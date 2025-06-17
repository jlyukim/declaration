# TODOs for Declaration Web Game

## Phase 0: Setup & Planning

- [x] Write planning documents (`README.md`, `rules.md`, `todos.md`)
- [ ] Set up Git repository
- [ ] Initialize project structure
  - [ ] `server/` for backend
  - [ ] `public/` for frontend assets
- [ ] Install base dependencies (`express`, `ws`, etc.)
- [ ] Set up basic dev workflow (live server, nodemon, ESLint optional)

## Phase 1: Barebones Game (Local, No UI)

Goal: Single-screen game with auto-dealt cards, hardcoded asks, minimal UI (console/logs ok)

- [ ] Create card deck generator (52 cards or custom set)
- [ ] Implement shuffle and deal logic
- [ ] Represent player hands on server
- [ ] Hardcode player turn order and basic ask rules
- [ ] Implement basic ask logic (server-side only)
- [ ] Server logs or JSON object output for game state and turn flow
- [ ] End game condition (5 points) in place, no UI yet
- [ ] Add console input simulation or dummy front-end buttons for ask

## Phase 2: Card Sprites & Frontend Skeleton

Goal: Visualize cards and game state using simple HTML/CSS and placeholder sprites

- [ ] Find placeholder card assets (Balatro screenshot or public domain set)
- [ ] Display local player’s hand in browser
- [ ] Show opponent card counts
- [ ] Render cards as image elements or styled divs
- [ ] Basic visual layout of 6 players around a table
- [ ] Style cards with high-contrast colors (CSS)
- [ ] Add hover/select interaction to choose cards

## Phase 3: Multiplayer & Lobby System

Goal: Real-time multiplayer with WebSocket connection and lobby creation/joining

- [ ] Set up WebSocket server (`ws` or similar)
- [ ] Broadcast player joins, asks, and results
- [ ] Implement lobby system
  - [ ] Generate lobby code
  - [ ] Allow players to join via code
  - [ ] Assign unique IDs and names
  - [ ] Track readiness and team assignment
- [ ] Handle disconnection and room cleanup
- [ ] Send player-specific data only (private hands)
- [ ] Start game when 6 players ready
- [ ] Add turn rotation logic and ask validation
- [ ] Sync all game state between clients

## Phase 4: UI & Game Interaction Polish

Goal: Replace temporary UI with real interactive game screen and visuals

- [ ] Add main menu
  - [ ] Create lobby
  - [ ] Join lobby
  - [ ] Enter name
- [ ] In-game screen
  - [ ] Display all 6 players
  - [ ] Highlight current player
  - [ ] Team color indicators
  - [ ] Number of cards per player
  - [ ] Ask controls (dropdowns or click + target)
  - [ ] Declare controls
  - [ ] Feedback area (result bubbles)
  - [ ] Game log / ask history area
- [ ] Add win screen or end-of-game popup

## Phase 5: Extras & Enhancements (Post-MVP)

These can be tracked separately once MVP is playable

- [ ] Random team generation
- [ ] Training mode (scripted AI/demo)
- [ ] CPU bots (basic logic, memory-limited)
- [ ] Match export to `.txt` or `.json`
- [ ] Elo rating system
- [ ] Spectator support (view-only)
- [ ] Responsive/mobile-friendly layout
- [ ] Chat system in lobby/game
- [ ] Reconnection flow for disconnected players
- [ ] Match history viewer
- [ ] Tournament support (brackets, scores)

## Testing & Deployment

- [ ] Add local test script to simulate 6 players
- [ ] Manual test: multiple tabs in local browser
- [ ] Deployment pipeline (Heroku/Vercel/Fly.io/etc.)
- [ ] Enable HTTPS and secure WebSocket (wss)
- [ ] Add simple monitoring/logs
