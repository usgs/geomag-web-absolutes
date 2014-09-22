CREATE TABLE sessions (id INT PRIMARY KEY AUTO_INCREMENT, sess_id VARCHAR(255) UNIQUE NOT NULL, sess_time INT, sess_data TEXT, INDEX (sess_time));
