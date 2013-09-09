<?php

	if (count($argv) < 1) {
		print "Usage: php ObservatoryFactory.test.php\n";
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

		// Get all observatories
		$observatories = $OBSERVATORY_FACTORY->getObservatories();
		notify('Get all observatories', count($observatories) > 0, true);

		// Get a single observatory
		$observatory = $OBSERVATORY_FACTORY->getObservatory(1);
		notify('Get single observatory', 1, $observatory->id);
		notify('Get instruments', true, count($observatory->instruments) > 0);
		notify('Get observations', true, $observatory->observations != null);
		notify('Get piers', true, count($observatory->piers) > 0);
		notify('Get marks', true, count(reset($observatory->piers)->marks) > 0);

		// Get a non-existent observatory
		$observatory = $OBSERVATORY_FACTORY->getObservatory(-1);
		notify('Get non-existent single observatory', null, $observatory);
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

