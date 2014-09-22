CREATE TABLE sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, sess_id VARCHAR(255) UNIQUE NOT NULL, sess_time INTEGER, sess_data TEXT);
CREATE INDEX sessions_time_index ON sessions(sess_time);
