-- Database Schema for Cron Monitor

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Cron Jobs Table
CREATE TABLE cron_jobs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    table_type VARCHAR(50) NOT NULL CHECK (table_type IN ('Redis', 'Summary Refresh', 'User Redis Load')),
    environment VARCHAR(20) NOT NULL CHECK (environment IN ('Dev', 'QA', 'Prod')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Logs Table
CREATE TABLE job_logs (
    id SERIAL PRIMARY KEY,
    cron_job_id INTEGER REFERENCES cron_jobs(id),
    log_message TEXT NOT NULL,
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('info', 'warning', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_cron_jobs_table_type ON cron_jobs(table_type);
CREATE INDEX idx_cron_jobs_environment ON cron_jobs(environment);
CREATE INDEX idx_cron_jobs_status ON cron_jobs(status);
CREATE INDEX idx_cron_jobs_start_time ON cron_jobs(start_time);
CREATE INDEX idx_job_logs_cron_job_id ON job_logs(cron_job_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cron_jobs_updated_at
    BEFORE UPDATE ON cron_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();