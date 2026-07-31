import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EpisodeCard, ProfileCard, ShowData } from './models/show-data.model';
import { ShowService } from './services/show.service';

type ScreenStage = 'gate' | 'intro' | 'profiles' | 'hero' | 'player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('playerVideo') playerVideoRef?: ElementRef<HTMLVideoElement>;

  data?: ShowData;
  stage: ScreenStage = 'gate';
  selectedProfile?: ProfileCard;
  selectedEpisode?: EpisodeCard;
  activeEpisodeId = '';
  password = '';
  errorMessage = '';
  loading = true;
  private introTimerId?: ReturnType<typeof setTimeout>;
  private playerVideoReady = false;
  private profileCentered = false;

  constructor(private readonly showService: ShowService) {}

  ngOnInit(): void {
    this.showService.getShowData().subscribe({
      next: (data) => {
        this.data = data;
        this.selectedProfile = data.profiles[0];
        this.activeEpisodeId = data.episodes[0]?.id ?? '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load the show data right now.';
      }
    });
  }

  submitPassword(): void {
    if (!this.password.trim()) {
      this.errorMessage = 'Enter the access password first.';
      return;
    }

    this.showService.unlock(this.password.trim()).subscribe({
      next: (response) => {
        this.errorMessage = response.success ? '' : response.message;
        if (response.success) {
          this.showIntroThenProfiles();
        }
      },
      error: () => {
        this.errorMessage = 'Unable to verify the password right now.';
      }
    });
  }

  private showIntroThenProfiles(): void {
    if (this.introTimerId) {
      clearTimeout(this.introTimerId);
    }

    this.stage = 'intro';
    this.introTimerId = setTimeout(() => {
      this.stage = 'profiles';
      // center the profile card after entering the profiles screen
      setTimeout(() => this.centerProfileCard(), 120);
      this.introTimerId = undefined;
    }, 2600);
  }

  enterProfile(profile: ProfileCard): void {
    this.selectedProfile = profile;
    this.stage = 'hero';
  }

  backToProfiles(): void {
    this.stage = 'profiles';
  }

  selectEpisode(episodeId: string): void {
    this.activeEpisodeId = episodeId;
    // scroll the selected card into view horizontally centered
    setTimeout(() => {
      try {
        const el = document.querySelector<HTMLElement>(`.episode-card[data-episode="${episodeId}"]`);
        if (el) {
          // calculate horizontal scroll so the element's center aligns with viewport center
          const rect = el.getBoundingClientRect();
          const elCenterX = rect.left + rect.width / 2 + window.scrollX;
          const targetScrollX = Math.max(0, Math.round(elCenterX - window.innerWidth / 2));
          window.scrollTo({ left: targetScrollX, behavior: 'smooth' });
        }
      } catch {
        // ignore
      }
    }, 80);
  }

  openEpisode(episode: EpisodeCard): void {
    this.selectedEpisode = episode;
    this.stage = 'player';
    // pause any looping card videos and then play the player with audio
    this.pauseAllCardVideos();
    this.playPlayerVideo();
  }

  backFromPlayer(): void {
    // pause and mute player, then return to hero
    const player = this.playerVideoRef?.nativeElement;
    if (player) {
      try {
        player.pause();
        player.muted = true;
        player.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.stage = 'hero';
  }

  toggleMusic(): void {
    return;
  }

  heroSummary(): string {
    return this.data?.storyLine ?? '';
  }

  ngOnDestroy(): void {
    if (this.introTimerId) {
      clearTimeout(this.introTimerId);
    }
  }

  ngAfterViewChecked(): void {
    if (this.stage === 'player' && this.playerVideoRef && !this.playerVideoReady) {
      this.playerVideoReady = true;
      this.playPlayerVideo();
      return;
    }

    if (this.stage !== 'player') {
      this.playerVideoReady = false;
    }

    if (this.stage === 'hero') {
      this.muteAllCardVideos();
    }

    // reset centering flag when leaving profiles so it will recentre next time
    if (this.stage !== 'profiles') {
      this.profileCentered = false;
    }

    // if we just switched to profiles, ensure the selected profile is centered once
    if (this.stage === 'profiles' && !this.profileCentered) {
      this.profileCentered = true;
      setTimeout(() => this.centerProfileCard(), 80);
    }
  }

  private playPlayerVideo(): void {
    const playerVideo = this.playerVideoRef?.nativeElement;
    if (!playerVideo) {
      return;
    }

    // ensure player audio is enabled when user opens an episode
    try {
      playerVideo.muted = false;
      playerVideo.volume = 1;
    } catch {
      // ignore
    }

    playerVideo.play().catch(() => {
      /* no-op: user can press play manually */
    });
  }

  private pauseAllCardVideos(): void {
    try {
      const els = document.querySelectorAll<HTMLVideoElement>('.episode-video');
      els.forEach((v) => {
        try {
          v.pause();
          v.muted = true;
          v.volume = 0;
        } catch {}
      });
    } catch {
      // ignore
    }
  }

  private muteAllCardVideos(): void {
    try {
      const els = document.querySelectorAll<HTMLVideoElement>('.episode-video');
      els.forEach((v) => {
        try {
          v.muted = true;
          v.volume = 0;
        } catch {}
      });
    } catch {
      // ignore
    }
  }

  private centerProfileCard(): void {
    try {
      const profileId = this.selectedProfile?.id ?? (this.data?.profiles[0]?.id ?? '');
      const el = document.querySelector<HTMLElement>(`.profile-card[data-profile="${profileId}"]`);
      if (!el) return;

      // let the browser center the element in both axes
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } catch {
      // ignore
    }
  }
}
