PRAGMA foreign_keys = OFF;

CREATE TABLE [observatory] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[code] CHAR(5)  UNIQUE NOT NULL,
[name] VARCHAR(255)  NULL,
[default_pier_id] INTEGER NULL,
[location] VARCHAR(255)  NULL,
[latitude] NUMERIC  NULL,
[longitude] NUMERIC  NULL,
[geomagnetic_latitude] NUMERIC  NULL,
[geomagnetic_longitude] NUMERIC  NULL,
[elevation] NUMERIC  NULL,
[orientation] VARCHAR(255)  NULL,
CONSTRAINT observatory_uniq UNIQUE (code) ON CONFLICT ABORT,
FOREIGN KEY(default_pier_id) REFERENCES pier(id)
);

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
FOREIGN KEY(default_electronics_id) REFERENCES instrument(id)
);

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

CREATE TABLE [observation] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observatory_id] INTEGER NOT NULL,
[begin] INTEGER  NOT NULL,
[end] INTEGER  NULL,
[annotation] TEXT NULL,
CONSTRAINT observation_uniq UNIQUE (observatory_id, begin) ON CONFLICT ABORT,
FOREIGN KEY(observatory_id) REFERENCES observatory(id)
);

CREATE TABLE [reading] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[observation_id] INTEGER NOT NULL,
[set_number] INTEGER NOT NULL, 
[mark_id] INTEGER NOT NULL,
[electronics_id] INTEGER NOT NULL,
[theodolite_id] INTEGER NOT NULL,
[temperature] NUMERIC NOT NULL,
[declination_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[horizontal_intensity_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[vertical_intensity_valid] CHAR(1) NOT NULL DEFAULT 'Y',
[observer] VARCHAR(255) NOT NULL,
[annotation] TEXT NULL,
CONSTRAINT reading_uniq UNIQUE (observation_id, set_number) ON CONFLICT ABORT,
FOREIGN KEY(observation_id) REFERENCES observation(id),
FOREIGN KEY(mark_id) REFERENCES mark(id),
FOREIGN KEY(electronics_id) REFERENCES instruments(id),
FOREIGN KEY(theodolite_id) REFERENCES instruments(id)
);

CREATE TABLE [measurement] (
[ID] INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
[reading_id] INTEGER NOT NULL,
[type] CHAR(20) NOT NULL, 
[time] INTEGER NOT NULL,
[angle] INTEGER NOT NULL,
CONSTRAINT measurement_uniq UNIQUE (reading_id, type, time, angle) ON CONFLICT ABORT,
FOREIGN KEY(reading_id) REFERENCES reading(id),
CONSTRAINT measurement_ck1 CHECK (type IN ('first_mark_up', 'first_mark_down', 'west_down', 'east_down', 'west_up', 'east_up', 'second_mark_up', 'second_mark_down', 'south_down', 'north_up', 'south_up', 'north_down'))
);

PRAGMA foreign_keys = ON;

