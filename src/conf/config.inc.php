<?php

// set default timezone
date_default_timezone_set('UTC');


// read configuration
$CONFIG = parse_ini_file('config.ini');
$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];
$REALTIME_DATA_URL = $CONFIG['REALTIME_DATA_URL'];


include_once $APP_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'lib.inc.php';

// connect to database
$DB = new PDO($CONFIG['DB_DSN'], $CONFIG['DB_USER'], $CONFIG['DB_PASS']);
// use php exceptions for query problems
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// create factories
$OBSERVATORY_FACTORY = new ObservatoryFactory($DB);
$OBSERVATION_FACTORY = new ObservationFactory($DB);
$USER_FACTORY = new UserFactory($DB);

// set up database backed sessions
if (isset($CONFIG['USE_DATABASE_SESSIONS']) &&
		$CONFIG['USE_DATABASE_SESSIONS'] === 'true') {
	if (PHP_VERSION_ID < 50400) {
		echo 'Database sessions require php version 5.4+';
		exit();
	}
	session_set_save_handler(new PdoSessionHandler($DB), true);
}

// set version number string
$VERSION = '(v1.1.1)';
