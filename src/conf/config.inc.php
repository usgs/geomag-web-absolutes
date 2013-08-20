<?php

// set default timezone
date_default_timezone_set('UTC');


// read configuration
$CONFIG = parse_ini_file('config.ini');
$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];


$dburl = 'sqlite:' . $DATA_DIR . DIRECTORY_SEPARATOR . $CONFIG['SQLITE_DB'];
$dbschema = '../lib/sql/sqlite/create_tables.sql';


// connect to database
$DB = new PDO($dburl);
// use php exceptions for query problems
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// verify database has schema
try {
	$rs = $DB->query('select count(*) from observatory');
} catch (PDOException $e) {
	// database doesn't have schema, load
	$DB->exec(file_get_contents($dbschema));
}

