<?php
// This script prompts user if they would like to set up the database this
// includes the following steps.
//
// (1) Create the database schema
//     (1.1) If initially answering yes, notify current content may be
//           destroyed. If user confirms descision, wipe existing database and
//           create a new schema using script.
// (2) Load reference data into the database.
// (3) [Only if script is run directly]
//     Load observation data into database.
//
// Note: If the user declines any step along the way this script is complete.

date_default_timezone_set('UTC');

$CONFIG_FILE = '../conf/config.ini';
$DO_DATA_LOAD = (basename($argv[0]) === 'setup_database.php');

include_once 'install-funcs.inc.php';

// Initial configuration stuff
if (!file_exists($CONFIG_FILE)) {
  print "$CONFIG_FILE not found. Please configure the application " .
      'before trying to set up the database. Configuration can be ' .
      "done as part of the installation process.\n";
  exit(-1);
}
$CONFIG = parse_ini_file($CONFIG_FILE);
$DB_DSN = configure('DB_ROOT_DSN', '', 'Database administrator DSN');
$dbtype = substr($DB_DSN, 0, strpos($DB_DSN, ':'));
$username = configure('DB_ROOT_USER', 'root', 'Database adminitrator user');
$password = configure('DB_ROOT_PASS', '', 'Database administrator password',
    true);

$defaultScriptDir = implode(DIRECTORY_SEPARATOR, array(
    $CONFIG['APP_DIR'], 'lib', 'sql', $dbtype));
$defaultReferenceDir = implode(DIRECTORY_SEPARATOR, array(
    $CONFIG['APP_DIR'], 'lib', 'sql', 'reference_data'));


// ----------------------------------------------------------------------
// Schema loading configuration
// ----------------------------------------------------------------------

$answer = configure('DO_SCHEMA_LOAD', 'Y',
    "\nWould you like to create the database schema");

if (!responseIsAffirmative($answer)) {
  print "Normal exit.\n";
  exit(0);
}

$answer = configure('CONFIRM_DO_SCHEMA_LOAD', 'N',
    "Loading the schema removes any existing schema and/or data.\n" .
    'Are you sure you wish to continue');

if (!responseIsAffirmative($answer)) {
  print "Normal exit.\n";
  exit(0);
}

// Find schema load file
$schemaScript = configure('SCHEMA_SCRIPT',
    $defaultScriptDir . DIRECTORY_SEPARATOR . 'create_tables.sql',
    'SQL script containing schema definition');
if (!file_exists($schemaScript)) {
  print "The indicated script does not exist. Please try again.\n";
  exit(-1);
}
$dropSchemaScript = configure('SCHEMA_SCRIPT',
    str_replace('create_tables.sql', 'drop_tables.sql', $schemaScript),
    'SQL script containing schema definition');
if (!file_exists($dropSchemaScript)) {
  print "The indicated script does not exist. Please try again.\n";
  exit(-1);
}


// ----------------------------------------------------------------------
// Create Database
// ----------------------------------------------------------------------
include_once 'install/DatabaseInstaller.class.php';
$dbInstaller = DatabaseInstaller::getInstaller($DB_DSN, $username, $password);

// make sure database exists
if (!$dbInstaller->databaseExists()) {
  $dbInstaller->createDatabase();
}


// ----------------------------------------------------------------------
// Create Schema
// ----------------------------------------------------------------------

// run drop tables
$dbInstaller->runScript($dropSchemaScript);
// create schema
$dbInstaller->runScript($schemaScript);
// create read/write user for save
$dbInstaller->createUser(array('SELECT', 'INSERT', 'UPDATE', 'DELETE'),
    $CONFIG['DB_USER'], $CONFIG['DB_PASS']);

print "Schema loaded successfully!\n";


// ----------------------------------------------------------------------
// Reference data loading
// ----------------------------------------------------------------------

$answer = configure('DO_REFERENCE_LOAD', 'Y',
    "\nWould you like to load reference data");

if (!responseIsAffirmative($answer)) {
  print "Normal exit.\n";
  exit(0);
}

$referenceDir = configure('REFERENCE_DIR', $defaultReferenceDir,
    'SQL directory containing reference data');

if (!is_dir($referenceDir)) {
  print "\tThe indicated directory does not exist. Please try again.\n";
  exit(-1);
}

foreach (glob($referenceDir . DIRECTORY_SEPARATOR . '*.sql') as $script) {
  print "\tLoading data from '$script'\n";
  $dbInstaller->runScript($script);
}

print "Reference data loaded successfully!\n";


// ----------------------------------------------------------------------
// Observation data loading
// ----------------------------------------------------------------------

if (!$DO_DATA_LOAD) {
  print "Normal exit.\n";
  exit(0);
}

$answer = configure('DO_DATA_LOAD', 'Y',
    "\nWould you like to load observation data");

if (!responseIsAffirmative($answer)) {
  print "Normal exit.\n";
  exit(0);
}

// data loading script, which can be run separately
include 'load_bns.php';

// ----------------------------------------------------------------------
// Done
// ----------------------------------------------------------------------

print "\nNormal exit.\n";
exit(0);
