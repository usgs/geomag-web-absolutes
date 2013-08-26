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
		DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . 'sqlite' . 
		DIRECTORY_SEPARATOR . 'create_tables.sql';

// PHP Classes
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'Instrument.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR .  'Mark.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'Observatory.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'Observation.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'ObservatoryDetail.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'ObservatoryFactory.class.php';
include_once $DATA_DIR . DIRECTORY_SEPARATOR .'lib' . DIRECTORY_SEPARATOR . 
		'classes' . DIRECTORY_SEPARATOR . 'Pier.class.php';

// connect to database
$DB = new PDO($dburl);
// use php exceptions for query problems
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$OBSERVATORY_FACTORY = new ObservatoryFactory($DB);

// verify database has schema
try {
	$rs = $DB->query('select count(*) from observatory');
} catch (PDOException $e) {
	// database doesn't have schema, load
	$DB->exec(file_get_contents($dbschema));
}
?>
