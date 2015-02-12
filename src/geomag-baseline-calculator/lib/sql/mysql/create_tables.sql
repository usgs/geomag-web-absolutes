SET foreign_key_checks = 0;
CREATE TABLE observatory (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,code CHAR(5)  UNIQUE NOT NULL,name VARCHAR(255)  NULL,location VARCHAR(255)  NULL,latitude DECIMAL(13,7)  NULL,longitude DECIMAL(13,7)  NULL,geomagnetic_latitude DECIMAL(13,7)  NULL,geomagnetic_longitude DECIMAL(13,7)  NULL,elevation DECIMAL(13,7)  NULL,orientation VARCHAR(255)  NULL,default_pier_id INTEGER NULL,FOREIGN KEY(default_pier_id) REFERENCES pier(id));
CREATE TABLE pier (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,observatory_id INTEGER  NOT NULL,name VARCHAR(255)  NOT NULL,begin INTEGER NULL,end INTEGER  NULL,correction DECIMAL(13,7)  NULL,default_mark_id INT  NULL,default_electronics_id INT  NULL,default_theodolite_id INT  NULL,CONSTRAINT pier_uniq UNIQUE (observatory_id, name, correction, begin),FOREIGN KEY(observatory_id) REFERENCES observatory(id),FOREIGN KEY(default_mark_id) REFERENCES mark(id),FOREIGN KEY(default_electronics_id) REFERENCES instrument(id),FOREIGN KEY(default_theodolite_id) REFERENCES instrument(id));
CREATE TABLE mark (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,pier_id INTEGER  NOT NULL,name VARCHAR(255)  NOT NULL,begin INTEGER NULL,end INTEGER  NULL,azimuth DECIMAL(13,7)  NULL,CONSTRAINT mark_uniq UNIQUE (pier_id, name, azimuth, begin),FOREIGN KEY(pier_id) REFERENCES pier(id));
CREATE TABLE instrument (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,observatory_id INTEGER  NOT NULL,serial_number VARCHAR(255) NOT NULL,begin INTEGER NULL,end INTEGER  NULL,name VARCHAR(255) NULL,type VARCHAR(255) NOT NULL,CONSTRAINT instrument_uniq UNIQUE (observatory_id, serial_number, type, begin),FOREIGN KEY(observatory_id) REFERENCES observatory(id));
CREATE TABLE observation (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,observatory_id INTEGER NOT NULL,begin INTEGER  NOT NULL,end INTEGER  NULL,observer_user_id INTEGER,reviewer_user_id  INTEGER,pier_temperature DECIMAL(13,7),elect_temperature DECIMAL(13,7),flux_temperature DECIMAL(13,7),proton_temperature DECIMAL(13,7),mark_id INTEGER NOT NULL,electronics_id INTEGER,theodolite_id INTEGER,reviewed CHAR(1) NOT NULL DEFAULT 'N',annotation TEXT NULL,CONSTRAINT observation_uniq UNIQUE (observatory_id, begin),FOREIGN KEY(observatory_id) REFERENCES observatory(id),FOREIGN KEY(observer_user_id) REFERENCES user(id),FOREIGN KEY(reviewer_user_id) REFERENCES user(id),FOREIGN KEY(mark_id) REFERENCES mark(id),FOREIGN KEY(electronics_id) REFERENCES instrument(id),FOREIGN KEY(theodolite_id) REFERENCES instrument(id));
CREATE TABLE reading (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,observation_id INTEGER NOT NULL,set_number INTEGER NOT NULL,declination_valid CHAR(1) NOT NULL DEFAULT 'Y',declination_shift INTEGER NOT NULL,horizontal_intensity_valid CHAR(1) NOT NULL DEFAULT 'Y',vertical_intensity_valid CHAR(1) NOT NULL DEFAULT 'Y',startH INTEGER,endH INTEGER,absH DECIMAL(13,7),baseH DECIMAL(13,7),startZ INTEGER,endZ INTEGER,absZ DECIMAL(13,7),baseZ DECIMAL(13,7),startD INTEGER,endD INTEGER,absD DECIMAL(13,7),baseD DECIMAL(13,7),annotation TEXT NULL, CONSTRAINT reading_uniq UNIQUE (observation_id, set_number),FOREIGN KEY(observation_id) REFERENCES observation(id));
CREATE TABLE measurement (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,reading_id INTEGER NOT NULL,type CHAR(20) NOT NULL CHECK(type IN ('FirstMarkUp','FirstMarkDown','SecondMarkUp','SecondMarkDown','NorthDown','NorthUp','SouthDown','SouthUp','EastDown','EastUp','WestDown','WestUp')), time INTEGER,angle REAL NOT NULL,h DECIMAL(13,7),e DECIMAL(13,7),z DECIMAL(13,7),f DECIMAL(13,7),FOREIGN KEY(reading_id) REFERENCES reading(id));
CREATE TABLE user (ID INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255),username VARCHAR(255)  NOT NULL,default_observatory_id INTEGER,email VARCHAR(255),password VARCHAR(255),last_login INTEGER,admin CHAR(1) NOT NULL DEFAULT 'N',enabled CHAR(1) NOT NULL DEFAULT 'Y',CONSTRAINT user_uniq UNIQUE (username),FOREIGN KEY(default_observatory_id) REFERENCES observatory(id));
CREATE TABLE sessions (ID INTEGER PRIMARY KEY AUTO_INCREMENT, sess_id VARCHAR(255) UNIQUE NOT NULL, sess_time INTEGER, sess_data TEXT);
CREATE INDEX sessions_time_index ON sessions(sess_time);
SET foreign_key_checks = 1;