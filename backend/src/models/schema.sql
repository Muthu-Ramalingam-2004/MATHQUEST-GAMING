-- MathQuest Database Schema Definition (PostgreSQL / Supabase-ready)

-- 1. Users Table (Auth credentials)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student Profiles Table (XP, level, coins, streaks)
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

-- 3. Questions Table (Syllabus database)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) PRIMARY KEY,
    class_grade INTEGER NOT NULL,
    chapter_id VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'mcq', 'numerical', 'boolean'
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

-- 4. Game Sessions Table (Tracks live sessions)
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

-- 5. Student Progress Table (Accuracy tracks)
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

-- 6. Student Badges Table (Achievement links)
CREATE TABLE IF NOT EXISTS student_badges (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) NOT NULL, -- 'first-victory', 'perfect-score', etc.
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, badge_id)
);
