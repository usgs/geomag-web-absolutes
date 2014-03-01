/* create all WebAbsolutes tables */
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS [observatory];

CREATE TABLE [observatory] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[code] CHAR(5)  UNIQUE NOT NULL,
[name] VARCHAR(255)  NULL,
[location] VARCHAR(255)  NULL,
[latitude] NUMERIC  NULL,
[longitude] NUMERIC  NULL,
[geomagnetic_latitude] NUMERIC  NULL,
[geomagnetic_longitude] NUMERIC  NULL,
[elevation] NUMERIC  NULL,
[orientation] VARCHAR(255)  NULL,
[default_pier_id] INTEGER NULL,
FOREIGN KEY(default_pier_id) REFERENCES pier(id)
);

DROP TABLE IF EXISTS [pier];

CREATE TABLE [pier] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observatory_id] INTEGER  NOT NULL,
[name] VARCHAR(255)  NOT NULL,
[begin] INTEGER  NOT NULL,
[end] INTEGER  NULL,
[correction] NUMERIC  NULL,
[default_mark_id] INT  NULL,
[default_electronics_id] INT  NULL,
[default_theodolite_id] INT  NULL,
CONSTRAINT pier_uniq UNIQUE (observatory_id, name, begin) ON CONFLICT ABORT,
FOREIGN KEY(observatory_id) REFERENCES observatory(id),
FOREIGN KEY(default_mark_id) REFERENCES mark(id),
FOREIGN KEY(default_electronics_id) REFERENCES instrument(id),
FOREIGN KEY(default_theodolite_id) REFERENCES instrument(id)
);

DROP TABLE IF EXISTS [mark];

CREATE TABLE [mark] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[pier_id] INTEGER  NOT NULL,
[name] VARCHAR(255)  NOT NULL,
[begin] INTEGER  NOT NULL,
[end] INTEGER  NULL,
[azimuth] NUMERIC  NULL,
CONSTRAINT mark_uniq UNIQUE (pier_id, name, begin) ON CONFLICT ABORT,
FOREIGN KEY(pier_id) REFERENCES pier(id)
);

DROP TABLE IF EXISTS [instrument];

CREATE TABLE [instrument] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observatory_id] INTEGER  NOT NULL,
[serial_number] VARCHAR(255) NOT NULL,
[begin] INTEGER  NOT NULL,
[end] INTEGER  NULL,
[name] VARCHAR(255) NULL,
[type] VARCHAR(255) NOT NULL,
CONSTRAINT instrument_uniq UNIQUE (observatory_id, serial_number, begin) ON CONFLICT ABORT,
FOREIGN KEY(observatory_id) REFERENCES observatory(id)
);


DROP TABLE IF EXISTS [observation];

CREATE TABLE [observation] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observatory_id] INTEGER NOT NULL,
[begin] INTEGER  NOT NULL,
[end] INTEGER  NULL,
[reviewer_user_id]  INTEGER,
[pier_temperature] NUMERIC,
[elect_temperature] NUMERIC,
[flux_temperature] NUMERIC,
[proton_temperature] NUMERIC,
[mark_id] INTEGER NOT NULL,
[electronics_id] INTEGER,
[theodolite_id] INTEGER,
[reviewed] CHAR(1) NOT NULL DEFAULT 'N',
[annotation] TEXT NULL,
CONSTRAINT observation_uniq UNIQUE (observatory_id, begin) ON CONFLICT ABORT,
FOREIGN KEY(observatory_id) REFERENCES observatory(id),
FOREIGN KEY(reviewer_user_id) REFERENCES user(id),
FOREIGN KEY(mark_id) REFERENCES mark(id),
FOREIGN KEY(electronics_id) REFERENCES instrument(id),
FOREIGN KEY(theodolite_id) REFERENCES instrument(id)
);

DROP TABLE IF EXISTS [reading];

CREATE TABLE [reading] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observation_id] INTEGER NOT NULL,
[set_number] INTEGER NOT NULL, 
[observer_user_id]  INTEGER,
[declination_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[declination_shift] INTEGER NOT NULL,
[horizontal_intensity_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[vertical_intensity_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[annotation] TEXT NULL,
CONSTRAINT reading_uniq UNIQUE (observation_id, set_number) ON CONFLICT ABORT,
FOREIGN KEY(observation_id) REFERENCES observation(id),
FOREIGN KEY(observer_user_id) REFERENCES user(id)
);


DROP TABLE IF EXISTS [measurement];

CREATE TABLE [measurement] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[reading_id] INTEGER NOT NULL,
[type] CHAR(20) NOT NULL CHECK(type IN ('FirstMarkUp','FirstMarkDown','SecondMarkUp','SecondMarkDown','NorthDown','NorthUp','SouthDown','SouthUp','EastDown','EastUp','WestDown','WestUp')), 
[time] INTEGER,
[angle] REAL NOT NULL,
[h] NUMERIC,
[e] NUMERIC,
[z] NUMERIC,
[f] NUMERIC,
FOREIGN KEY(reading_id) REFERENCES reading(id)
);


DROP TABLE IF EXISTS [user];

CREATE TABLE [user] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[name] VARCHAR(255),
[username] VARCHAR(255)  NOT NULL,
[default_observatory_id] INTEGER,
[email] VARCHAR(255),
[password] VARCHAR(255),
[last_login] INTEGER,
[enabled] CHAR(1) NOT NULL DEFAULT 'Y',
CONSTRAINT user_uniq UNIQUE (username) ON CONFLICT ABORT,
FOREIGN KEY(default_observatory_id) REFERENCES observatory(id)
);


DROP TABLE IF EXISTS [role];
CREATE TABLE [role] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[name] VARCHAR(255),
[description] VARCHAR(255)  NOT NULL,
CONSTRAINT role_uniq UNIQUE (name) ON CONFLICT ABORT
);

DROP TABLE IF EXISTS [user_role];
CREATE TABLE [user_role] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[user_id] INTEGER,
[role_id] INTEGER,
CONSTRAINT user_role_uniq UNIQUE (user_id, role_id) ON CONFLICT ABORT,
FOREIGN KEY(user_id) REFERENCES user(id)
FOREIGN KEY(role_id) REFERENCES role(id)
);

PRAGMA foreign_keys = ON;

