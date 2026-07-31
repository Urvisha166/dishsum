export interface HeroStat {
  label: string;
  value: string;
}

export interface ProfileCard {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  image: string;
  accent: string;
}

export interface EpisodeCard {
  id: string;
  label: string;
  title: string;
  description: string;
  duration: string;
  video: string;
  poster?: string;
  accent: string;
  featured?: boolean;
}

export interface ShowData {
  brand: string;
  pageTitle: string;
  passwordPrompt: string;
  passwordHint: string;
  defaultPassword: string;
  heroVideo: string;
  heroPoster: string;
  welcomeMessage: string;
  heroTitle: string;
  heroSubtitle: string;
  storyLine: string;
  tagline: string;
  stats: HeroStat[];
  profiles: ProfileCard[];
  episodes: EpisodeCard[];
  about: string;
  metadata: string[];
}

export interface UnlockResponse {
  success: boolean;
  message: string;
}
