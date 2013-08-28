<?php

	if (count($argv) < 1) {
		print "Usage: php ObservatoryFactory.test.php\n";
		exit(-1);
	}

	if (!function_exists('notify')) {
		function notify ($testName, $expectation, $actual) {
			$passed = ($expectation === $actual);

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
		notify('Get instruments', count($observatory->instruments) > 0, true);
		notify('Get observations', $observatory->observations != null, true);
		notify('Get piers', count($observatory->piers) > 0, true);
		notify('Get marks', count(reset($observatory->piers)->marks) > 0, true);

		// Get a non-existent observatory
		$observatory = $OBSERVATORY_FACTORY->getObservatory(-1);
		notify('Get single observatory', null, $observatory);
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

