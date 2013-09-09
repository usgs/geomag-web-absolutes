<?php

	if (count($argv) < 1) {
		print "Usage: php ObservationFactory.test.php\n";
		exit(-1);
	}

	if (!function_exists('notify')) {
		function notify ($testName, $expectation, $actual) {
			$passed = ($expectation == $actual);

			printf("[%s] Running test '%s' %s\n",
				$passed ? 'Passed' : 'Failed',
				$testName,
				($passed) ? '' : sprintf("(Expected '%s' received '%s')",
						$expectation, $actual)
			);

		}
	}

	include_once '../../../src/conf/config.inc.php';

	try {
		// ----- Tests ----- //

		// Get a single observation
		$observation = $OBSERVATION_FACTORY->getObservation(1);
		notify('Get single observation', 1, $observation->id);
		notify('Get readings', true, count($observation->readings) > 0);
		notify('Get measurements', true, count(reset($observation->readings)->
				measurements) > 0);

		// Get a non-existent observation
		$observation = $OBSERVATION_FACTORY->getObservation(-1);
		notify('Get non-existent single observation', null, $observation);
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

