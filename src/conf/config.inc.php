<?php

// set default timezone
date_default_timezone_set('UTC');


// read configuration
$CONFIG = parse_ini_file('config.ini');
$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];


$dburl = 'sqlite:' . $DATA_DIR . DIRECTORY_SEPARATOR . $CONFIG['SQLITE_DB'];
$dbschema = $DATA_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'sql' . DIRECTORY_SEPARATOR . 'sqlite' . DIRECTORY_SEPARATOR .
		'create_tables.sql';

include_once $APP_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'lib.inc.php';

// connect to database
$DB = new PDO($CONFIG['DB_DSN'], $CONFIG['DB_USER'], $CONFIG['DB_PASS']);
// use php exceptions for query problems
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// create factories
$OBSERVATORY_FACTORY = new ObservatoryFactory($DB);
$OBSERVATION_FACTORY = new ObservationFactory($DB);
