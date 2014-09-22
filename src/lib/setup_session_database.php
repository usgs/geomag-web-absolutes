<?php
// This script creates the session database schema using the configured
// session database dsn.

date_default_timezone_set('UTC');

$CONFIG_FILE = '../conf/config.ini';

include_once 'install-funcs.inc.php';

// Initial configuration stuff
if (!file_exists($CONFIG_FILE)) {
	print "$CONFIG_FILE not found. Please configure the application " .
			'before trying to set up the database. Configuration can be ' .
			"done as part of the installation process.\n";
	exit(-1);
}
$CONFIG = parse_ini_file($CONFIG_FILE);
$DB_DSN = $CONFIG['SESSION_DB_DSN'];

$dbtype = substr($DB_DSN, 0, strpos($DB_DSN, ':'));
$username = configure('DB_ROOT_USER', 'root',
		'Session database administrator user');
$password = configure('DB_ROOT_PASS', '',
		'Session database administrator password', true);

$defaultScriptDir = implode(DIRECTORY_SEPARATOR, array(
		$CONFIG['APP_DIR'], 'lib', 'sql', $dbtype));


// ----------------------------------------------------------------------
// Schema loading
// ----------------------------------------------------------------------

// Find schema load file
$schemaScript = configure('SCHEMA_SCRIPT',
		$defaultScriptDir . DIRECTORY_SEPARATOR . 'create_sessions_table.sql',
		'SQL script containing sessions schema definition');

if (!file_exists($schemaScript)) {
	print "The indicated script does not exist. Please try again.\n";
	exit(-1);
}

// Create an administrative connection to the database
if ($dbtype === 'mysql') {
	try {
		$setupdb = new PDO($DB_DSN, $username, $password);

		// If this connection worked, database already exists. We need to drop it.
		preg_match('/dbname=([^;]+)/', $DB_DSN, $matches);

		if (count($matches) < 2) {
			print "No database name (dbname) specified in DSN. This is required \n" .
			      "for MySQL connections. Check your configured DSN and try\n" .
						"again. Stopping.\n";
			exit(-1);
		}

		$dbname = $matches[1];

		// Make absolutely sure
		$answer = configure('DROP_DATABASE_CONFIRM', 'N', 'About to drop MySQL ' .
				"database ${dbname}. Are you sure you want to continue");

		if (!responseIsAffirmative($answer)) {
			print "Normal exit.\n";
			exit(0);
		}

		$db->exec('DROP DATABASE IF EXISTS ' . $dbname);

	} catch (Exception $ex) {

		// Whoops, database doesn't exist yet
		$setupdb = new PDO(str_replace("dbname=${dbname}", '', $DB_DSN),
				$username, $password);

	}

	$db->exec('CREATE DATABASE IF NOT EXISTS ' . $dbname);
	$db->exec('USE ' . $dbname);

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
$setupdb->exec(file_get_contents($schemaScript));

print "Schema loaded successfully!\n";
print "\nNormal exit.\n";
exit(0);
