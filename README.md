# Dishsum Project

This workspace now contains a MEAN-style build of the Loveflix-inspired experience from your screenshots.

## What is included

- Angular frontend with three states: password gate, profile picker, and cinematic show page.
- Express API with `/api/show`, `/api/profiles`, `/api/unlock`, and `/api/health`.
- Optional MongoDB persistence for password attempts when `MONGO_URI` is set.

## Run locally

1. Install frontend dependencies in the root folder.
2. Install backend dependencies in `server/`.
3. Start the API with `npm run api`.
4. Start Angular with `npm start`.

## Environment

- `SHOW_PASSWORD` controls the accepted password. Default: `loveflix`
- `MONGO_URI` enables MongoDB persistence for unlock attempts.
- `PORT` controls the API port. Default: `4000`

## Notes

- The UI is intentionally built to match the dark, red-glow Loveflix style from your screenshots.
- The episode art uses CSS visuals so the project works without downloading external media.
- Put your own files here:
  - `src/assets/videos/WhatsApp Video 2026-07-25 at 11.38.09 PM.mp4` for the background video
  - `src/assets/images/WhatsApp Image 2026-07-25 at 10.32.41 PM.jpeg` for the video poster and profile art
