CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username TEXT,
    full_name TEXT
);

CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    project_price NUMERIC,
    fee_amount NUMERIC,
    take_home_usd NUMERIC,
    target_currency TEXT,
    exchange_rate NUMERIC,
    final_amount NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);