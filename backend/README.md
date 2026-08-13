# MathQuest Express REST API Server

This is the Node.js + Express API backend server for **MathQuest**, providing JWT authentication, cheat-proof question verifications, progression level-ups, streaks, badge logs, and leaderboard calculations.

## Installation & Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   npm install
   ```
2. Copy and configure the environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run the development server with hot-reloading:
   ```bash
   npm run dev
   ```

## REST API Endpoint Registry

### Authentication (`/api/auth`)
- `POST /register`: Registers a new user and returns a token and student profile.
- `POST /login`: Validates password hashes and returns a JWT token.
- `GET /me`: Returns the active student profile details (requires Bearer JWT).

### Student Profiles (`/api/students`)
- `PUT /profile`: Updates name, avatar, class, and daily target goals.
- `GET /stats`: Returns overall syllabus progress percentages and badge shelves.
- `PUT /settings/sound`: Toggles sound effects (ON/OFF).
- `PUT /settings/darkmode`: Toggles dark themes.

### Curriculum Questions (`/api/questions`)
- `GET /`: Fetch list of questions, supports query queries: `?classGrade=10&chapterId=algebra-10&difficulty=Hard`.
- `POST /validate`: Verifies mathematical options or numerical inputs, preventing client cheating.

### Gameplay & Leaderboards (`/api/games`)
- `POST /session/start`: Records a new active session in database memory.
- `POST /session/finish`: Calculates score accuracies, updates streaks, awards XP, and unlocks badges.
- `GET /leaderboard`: Returns cohorts ranked descending by XP.

### Admin Operations (`/api/questions`)
- `POST /admin/create`: Insert custom math question into the syllabus.
- `PUT /admin/update/:id`: Update question formulas, options, or timer limits.
- `DELETE /admin/delete/:id`: Remove question entries.
