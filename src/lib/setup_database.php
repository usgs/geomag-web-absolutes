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
$DB_DSN = $CONFIG['DB_DSN'];
$dbtype = substr($DB_DSN, 0, strpos($DB_DSN, ':'));
$username = configure('DB_ROOT_USER', 'root', 'Database adminitrator user');
$password = configure('DB_ROOT_PASS', '', 'Database administrator password',
		true);

$defaultScriptDir = implode(DIRECTORY_SEPARATOR, array(
		$CONFIG['APP_DIR'], 'lib', 'sql', $dbtype));
$defaultReferenceDir = implode(DIRECTORY_SEPARATOR, array(
		$CONFIG['APP_DIR'], 'lib', 'sql', 'reference_data'));

$defaultParser = implode(DIRECTORY_SEPARATOR, array(
		$CONFIG['APP_DIR'], 'lib', 'sql', 'parse_observation'));


// ----------------------------------------------------------------------
// Schema loading
// ----------------------------------------------------------------------

$answer = configure('DO_SCHEMA_LOAD', 'Y',
		"\nWould you like to create the database schema");

if (!responseIsAffirmative($answer)) {
	print "Normal exit.\n";
	exit(0);
}

$answer = configure('CONFIRM_DO_SCHEMA_LOAD', 'Y',
		"Loading the schema removes any exist schema and/or data.\n" .
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

// Create an administrative connection to the database
if ($dbtype === 'mysql') {

	preg_match('/dbname=([^;]+)/', $DB_DSN, $matches);
	if (count($matches) < 2) {
		print "No database name (dbname) specified in DSN. This is required \n" .
		      "for MySQL connections. Check your configured DSN and try\n" .
					"again. Stopping.\n";
		exit(-1);
	}
	$dbname = $matches[1];

	try {
		$setupdb = new PDO($DB_DSN, $username, $password);

		// If this connection worked, database already exists. We need to drop it.
		$setupdb = null;

		// Make absolutely sure
		$answer = configure('DROP_DATABASE_CONFIRM', 'N', 'About to drop MySQL ' .
				"database ${dbname}. Are you sure you want to continue");

		if (!responseIsAffirmative($answer)) {
			print "Normal exit.\n";
			exit(0);
		}
		// Whoops, database doesn't exist yet
		$setupdb = new PDO(str_replace("dbname=${dbname}", '', $DB_DSN),
				$username, $password);
		$setupdb->exec('DROP DATABASE IF EXISTS ' . $dbname);

	} catch (Exception $ex) {

		// Whoops, database doesn't exist yet
		$setupdb = new PDO(str_replace("dbname=${dbname}", '', $DB_DSN),
				$username, $password);

	}

	$setupdb->exec('CREATE DATABASE IF NOT EXISTS ' . $dbname);
	$setupdb->exec('USE ' . $dbname);

} else if ($dbtype === 'sqlite') {

	if (preg_match('/:([^;]+)/', $DB_DSN, $matches)) {

		$dbfilename = $matches[1];

		if (file_exists($dbfilename)) {
			print "SQLite database ($dbfilename) exists. Backed up database to file " .
					"${dbfilename}.bak before removing.\n";
			rename($dbfilename, "${dbfilename}.bak");
		}
	}

	$setupdb = new PDO($DB_DSN, $username, $password);
}
$setupdb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Delete existing database, then re-create it
$schemaStatements = explode(';', file_get_contents($schemaScript));
foreach ($schemaStatements as $sql) {
	$sql = trim($sql);
	if ($sql !== '') {
		$setupdb->exec($sql);
	}
}

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
	$scriptContent = file_get_contents($script);

	// Remove /* */ comments
	$scriptContent = preg_replace('#/\*.*\*/#', '', $scriptContent);

	$referenceStatements = explode(';', $scriptContent);
	foreach ($referenceStatements as $sql) {
		$sql = trim($sql);
		if ($sql !== '') {
			$setupdb->exec($sql);
		}
	}
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

$dataDirectory = configure('DATA_DIR', $CONFIG['DATA_DIR'],
		'Enter directory where observatory files can be located');

if (!file_exists($dataDirectory)) {
	print "\tThe indicated directory does not exist. Please try again.\n";
	exit(-1);
}

include_once 'classes/ObservationFileParser.class.php';
include_once 'classes/ObservationFactory.class.php';
include_once 'classes/ObservatoryFactory.class.php';
$observatoryFactory = new ObservatoryFactory($setupdb);
$observationFactory = new ObservationFactory($setupdb);
$parser = new ObservationFileParser($observatoryFactory);

$files = recursiveGlob($dataDirectory, '*.bns');
$errorCount = 0;

foreach ($files as $file) {
	$warnings = array();

	try {
		$observation = $parser->parse($file, $warnings);
		$observationFactory->createObservation($observation);
	} catch (Exception $e) {
		$warnings[] = $e->getMessage();
	}

	if (count($warnings) !== 0) {
		$errorCount += 1;
		print "The following warnings occurred while processing file '${file}'\n  ";
		print implode("\n  ", $warnings) . "\n";
	}
}

// Show an error summary in case user wasn't watching too closely.
print "\nProcessed " . count($files) . " files with " . $errorCount .
		" errors.";

if ($errorCount !== 0) {
	print " See above for details.\n";
} else {
	print "\n";
}

// ----------------------------------------------------------------------
// Done
// ----------------------------------------------------------------------

print "\nNormal exit.\n";
exit(0);
