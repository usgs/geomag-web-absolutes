/* create all web absolutes tables */
CREATE DATABASE webabsolutes DEFAULT CHARACTER SET utf8;

USE webabsolutes;

DROP TABLE IF EXISTS `observatory`;
CREATE TABLE `observatory` (
  `ID` INTEGER NOT NULL AUTO_INCREMENT,
  `code` char(5) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,4) DEFAULT NULL,
  `longitude` decimal(10,4) DEFAULT NULL,
  `geomagnetic_latitude` decimal(10,4) DEFAULT NULL,
  `geomagnetic_longitude` decimal(10,4) DEFAULT NULL,
  `elevation` decimal(10,4) DEFAULT NULL,
  `orientation` varchar(255) DEFAULT NULL,
  `default_pier_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `observatory_uniq` (`code`)
) ENGINE=InnoDB;



DROP TABLE IF EXISTS `pier`;
CREATE TABLE `pier` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`observatory_id` INTEGER  NOT NULL,
`name` VARCHAR(255)  NOT NULL,
`begin` BIGINT  NOT NULL,
`end` BIGINT  NULL,
`correction` decimal(10,4)  NULL,
`default_mark_id` INT  NULL,
`default_electronics_id` INT  NULL,
`default_theodolite_id` INT  NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT pier_uniq UNIQUE KEY (observatory_id, name, begin)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `mark`;
CREATE TABLE `mark` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`pier_id` INTEGER  NOT NULL,
`name` VARCHAR(255)  NOT NULL,
`begin` BIGINT  NOT NULL,
`end` BIGINT  NULL,
`azimuth` decimal(10,4)  NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT mark_uniq UNIQUE KEY (pier_id, name, begin)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `instrument`;
CREATE TABLE `instrument` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`observatory_id` INTEGER  NOT NULL,
`serial_number` VARCHAR(255) NOT NULL,
`begin` BIGINT  NOT NULL,
`end` BIGINT  NULL,
`name` VARCHAR(255) NULL,
`type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT instrument_uniq UNIQUE KEY (observatory_id, serial_number, begin)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `observation`;
CREATE TABLE `observation` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`observatory_id` INTEGER NOT NULL,
`begin` BIGINT  NOT NULL,
`end` BIGINT  NULL,
`reviewer_user_id`  INTEGER,
`pier_temperature` decimal(10,4),
`elect_temperature` decimal(10,4),
`flux_temperature` decimal(10,4),
`proton_temperature` decimal(10,4),
`mark_id` INTEGER NOT NULL,
`electronics_id` INTEGER,
`theodolite_id` INTEGER,
`reviewed` CHAR(1) NOT NULL DEFAULT 'N',
`annotation` TEXT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT observation_uniq UNIQUE KEY (observatory_id, begin)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `reading`;
CREATE TABLE `reading` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`observation_id` INTEGER NOT NULL,
`set_number` INTEGER NOT NULL, 
`observer_user_id`  INTEGER,
`declination_valid` CHAR(1) NOT NULL DEFAULT 'Y',
`declination_shift` INTEGER NOT NULL,
`horizontal_intensity_valid` CHAR(1) NOT NULL DEFAULT 'Y',
`vertical_intensity_valid` CHAR(1) NOT NULL DEFAULT 'Y',
`annotation` TEXT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT reading_uniq UNIQUE KEY (observation_id, set_number)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `measurement`;
CREATE TABLE `measurement` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`reading_id` INTEGER NOT NULL,
`type` CHAR(20) NOT NULL CHECK(type IN ('FirstMarkUp','FirstMarkDown','SecondMarkUp','SecondMarkDown','NorthDown','NorthUp','SouthDown','SouthUp','EastDown','EastUp','WestDown','WestUp')), 
`time` BIGINT,
`angle` INTEGER NOT NULL,
`h` decimal(10,4),
`e` decimal(10,4),
`z` decimal(10,4),
`f` decimal(10,4),
  PRIMARY KEY (`ID`),
  CONSTRAINT measurement_uniq UNIQUE KEY (reading_id, type)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255),
`username` VARCHAR(255)  NOT NULL,
`default_observatory_id` INTEGER,
`email` VARCHAR(255),
`password` VARCHAR(255),
`last_login` INTEGER,
`enabled` CHAR(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`ID`),
  CONSTRAINT user_uniq UNIQUE KEY (username)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255),
`description` VARCHAR(255)  NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT role_uniq UNIQUE KEY (name)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
`ID` INTEGER  NOT NULL AUTO_INCREMENT,
`user_id` INTEGER,
`role_id` INTEGER,
  PRIMARY KEY (`ID`),
  CONSTRAINT user_role_uniq UNIQUE KEY (user_id, role_id)
) ENGINE=InnoDB;


/* enable constraints */
ALTER TABLE `observatory` ADD CONSTRAINT observatory_fk1 FOREIGN KEY(default_pier_id) REFERENCES pier(id);

ALTER TABLE `pier` ADD CONSTRAINT pier_fk1 FOREIGN KEY(observatory_id) REFERENCES observatory(id);
ALTER TABLE `pier` ADD CONSTRAINT pier_fk2 FOREIGN KEY(default_mark_id) REFERENCES mark(id);
ALTER TABLE `pier` ADD CONSTRAINT pier_fk3 FOREIGN KEY(default_electronics_id) REFERENCES instrument(id);
ALTER TABLE `pier` ADD CONSTRAINT pier_fk4 FOREIGN KEY(default_theodolite_id) REFERENCES instrument(id);

ALTER TABLE `mark` ADD CONSTRAINT mark_fk1 FOREIGN KEY(pier_id) REFERENCES pier(id);

ALTER TABLE `instrument` ADD CONSTRAINT instrument_fk1 FOREIGN KEY(observatory_id) REFERENCES observatory(id);

ALTER TABLE `observation` ADD CONSTRAINT observation_fk1 FOREIGN KEY(observatory_id) REFERENCES observatory(id);
ALTER TABLE `observation` ADD CONSTRAINT observation_fk2 FOREIGN KEY(reviewer_user_id) REFERENCES user(id);
ALTER TABLE `observation` ADD CONSTRAINT observation_fk3 FOREIGN KEY(mark_id) REFERENCES mark(id);
ALTER TABLE `observation` ADD CONSTRAINT observation_fk4 FOREIGN KEY(electronics_id) REFERENCES instrument(id);
ALTER TABLE `observation` ADD CONSTRAINT observation_fk5 FOREIGN KEY(theodolite_id) REFERENCES instrument(id);

ALTER TABLE `reading` ADD CONSTRAINT reading_fk1 FOREIGN KEY(observation_id) REFERENCES observation(id);
ALTER TABLE `reading` ADD CONSTRAINT reading_fk2 FOREIGN KEY(observer_user_id) REFERENCES user(id);

ALTER TABLE `measurement` ADD CONSTRAINT measurement_fk1 FOREIGN KEY(reading_id) REFERENCES reading(id);

ALTER TABLE `user` ADD CONSTRAINT user_fk1 FOREIGN KEY(default_observatory_id) REFERENCES observatory(id);

ALTER TABLE `user_role` ADD CONSTRAINT user_role_fk1 FOREIGN KEY(user_id) REFERENCES user(id);
ALTER TABLE `user_role` ADD CONSTRAINT user_role_fk2 FOREIGN KEY(role_id) REFERENCES role(id);

