-- MathQuest Database Schema Definition (PostgreSQL / Supabase-ready)

-- 1. Users Table (Auth credentials)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    grade INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(100) PRIMARY KEY,
    class_grade INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Student Profiles Table (XP, level, coins, streaks)
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(50) DEFAULT 'bear',
    class_grade INTEGER DEFAULT 10,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 50,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    last_played_date DATE,
    daily_goal INTEGER DEFAULT 50,
    sound_enabled BOOLEAN DEFAULT TRUE,
    dark_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Questions Table (Syllabus database)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) PRIMARY KEY,
    class_grade INTEGER NOT NULL,
    class INTEGER, -- Duplicate field for legacy support
    chapter_id VARCHAR(100) NOT NULL,
    chapter VARCHAR(100), -- Duplicate field for legacy support
    topic VARCHAR(100),
    type VARCHAR(30) NOT NULL, -- 'mcq', 'numerical', 'boolean'
    question_type VARCHAR(30), -- Duplicate field for legacy support
    difficulty VARCHAR(30) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    question TEXT NOT NULL,
    options JSONB, -- Array of strings for choices (A, B, C, D)
    correct_answer VARCHAR(255) NOT NULL, -- choice index or exact number
    explanation TEXT NOT NULL,
    hint TEXT,
    xp_reward INTEGER DEFAULT 30,
    time_limit INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Game Sessions Table (Tracks live sessions)
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100) NOT NULL,
    mode VARCHAR(50) NOT NULL, -- 'quick-quiz', 'math-run', etc.
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 5,
    xp_earned INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'completed', -- 'active', 'completed', 'aborted'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 7. Game Answers Table (Tracks answers during play)
CREATE TABLE IF NOT EXISTS game_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(100) REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Student Progress Table (Accuracy tracks)
CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100) NOT NULL,
    completed_questions INTEGER DEFAULT 0,
    accuracy INTEGER DEFAULT 0,
    times_played INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, chapter_id)
);

-- 9. Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Student Badges Table (Achievement links)
CREATE TABLE IF NOT EXISTS student_badges (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) NOT NULL, -- 'first-victory', 'perfect-score', etc.
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, badge_id)
);

-- 11. Leaderboard View (Dynamic ranks based on XP)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  sp.name,
  sp.avatar,
  sp.xp,
  sp.level,
  sp.streak,
  sp.created_at,
  RANK() OVER (ORDER BY sp.xp DESC) as rank
FROM student_profiles sp;

-- Indexes for performance tuning
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_class_grade_chapter_id ON questions(class_grade, chapter_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_student_id ON game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_student_id ON student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_session_id ON game_answers(session_id);
