<?php

// set default timezone
date_default_timezone_set('UTC');


// read configuration
$CONFIG = parse_ini_file('config.ini');
$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];


include_once $APP_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'lib.inc.php';

// connect to database
$DB = new PDO($CONFIG['DB_DSN'], $CONFIG['DB_USER'], $CONFIG['DB_PASS']);
// use php exceptions for query problems
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// create factories
$OBSERVATORY_FACTORY = new ObservatoryFactory($DB);
$OBSERVATION_FACTORY = new ObservationFactory($DB);

// set up database backed sessions
if (isset($CONFIG['SESSION_DB_DSN'])) {
	$SESSION_DB_DSN = $CONFIG['SESSION_DB_DSN'];
	if ($SESSION_DB_DSN !== '') {
		$SESSION_DB = new PDO($SESSION_DB_DSN, $CONFIG['SESSION_DB_USER'],
				$CONFIG['SESSION_DB_PASS']);
		$SESSION_DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		session_set_save_handler(new PdoSessionHandler($SESSION_DB), true);
	}
}
