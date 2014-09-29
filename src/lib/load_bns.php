<?php

date_default_timezone_set('UTC');

// work from lib directory
chdir(dirname($argv[0]));

$CONFIG_FILE = '../conf/config.ini';

// Initial configuration stuff
if (!file_exists($CONFIG_FILE)) {
	print "$CONFIG_FILE not found. Please configure the application " .
			'before trying to set up the database. Configuration can be ' .
			"done as part of the installation process.\n";
	exit(-1);
}

include_once 'install-funcs.inc.php';
include_once '../conf/config.inc.php';

$dataDirectory = configure('DATA_DIR', $CONFIG['DATA_DIR'],
		'Enter directory where observatory files can be located');

if (!file_exists($dataDirectory)) {
	print "\tThe indicated directory does not exist. Please try again.\n";
	exit(-1);
}

include_once 'classes/ObservationFileParser.class.php';
$parser = new ObservationFileParser($OBSERVATORY_FACTORY, $USER_FACTORY);

$files = recursiveGlob($dataDirectory, '*.bns');
$errorCount = 0;

foreach ($files as $file) {
	$warnings = array();

	try {
		$observation = $parser->parse($file, $warnings);
		$OBSERVATION_FACTORY->createObservation($observation);
	} catch (Exception $e) {
		$warnings[] = $e->getMessage();
	}

	if (count($warnings) !== 0) {
		$errorCount += 1;
		print "The following warnings occurred while processing '${file}'\n  ";
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
// Set begin times for instruments, marks, and piers,
// based on first time they are referenced by an observation
// ----------------------------------------------------------------------

// find instrument begin times
$rs = $DB->prepare('select i.ID, min(o.begin) as begin' .
		' from instrument i join observation o on ' .
		' (o.theodolite_id = i.ID or o.electronics_id = i.ID)' .
		' group by i.ID');
$rs->execute();
$instruments = $rs->fetchAll(PDO::FETCH_ASSOC);
// set begin times
$rs = $DB->prepare('update instrument set begin=:begin where ID=:id');
foreach ($instruments as $i) {
	$rs->execute(array(
			':id' => $i['ID'],
			':begin' => $i['begin']));
}

// find mark begin times
$rs = $DB->prepare('select m.ID, min(o.begin) as begin' .
		' from mark m join observation o on (m.ID = o.mark_id)' .
		' group by m.ID');
$rs->execute();
$marks = $rs->fetchAll(PDO::FETCH_ASSOC);
// set begin times
$rs = $DB->prepare('update mark set begin=:begin where ID=:id');
foreach ($marks as $m) {
	$rs->execute(array(
			':id' => $m['ID'],
			':begin' => $m['begin']));
}

// find pier begin times
$rs = $DB->prepare('select p.ID, min(m.begin) as begin' .
		' from pier p join mark m on (m.pier_id = p.ID)' .
		' group by p.ID');
$rs->execute();
$piers = $rs->fetchAll(PDO::FETCH_ASSOC);
// set begin times
$rs = $DB->prepare('update pier set begin=:begin where ID=:id');
foreach ($piers as $p) {
	$rs->execute(array(
			':id' => $p['ID'],
			':begin' => $p['begin']));
}


// ----------------------------------------------------------------------
// Done
// ----------------------------------------------------------------------

print "\nNormal exit.\n";
exit(0);
