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

		// Create an observation
		$measurements = array();
		$measurements[] = new Measurement(null, null, 'EastUpTime', time(),
				16500, 21500.82, -174.01, 47874.37, 52592.42);
		$readings = array();
		$readings[] = new Reading(null, null, 1, 21, 'Y', 'Y', 'Y',
				'Test of create', $measurements);
		$observation = new ObservationDetail(null, 1, time(), null, 15, 18,
				30, 31, 20.0, 17.1, 19.7, 14.6, "Test of create", $readings);
		$newobs = $OBSERVATION_FACTORY->createObservation($observation);
		notify('Create an observation', !null, $newobs);
		notify('Create readings', 1, count($newobs->readings));
		notify('Create measurements', 1, count($newobs->readings[0]->
				measurements));

		// Edit an observation
		$measurements[] = new Measurement(null, null, 'WestUpTime', time(),
				15000, 22000.00, -170.00, 47000.37, 52000.42);
		$readings2 = array();
		$readings2[] = new Reading(null, null, 1, 21, 'N', 'N', 'N',
				'Test of update', $measurements);
		$newobs->readings = $readings2;
		$newobs->annotation = "Test of update";
		$editobs = $OBSERVATION_FACTORY->updateObservation($newobs);
		notify('Update an observation', "Test of update", $editobs->annotation);
		notify('Update readings', "Test of update",
				$editobs->readings[0]->annotation);
		notify('Update measurements', 2, count($newobs->readings[0]->
				measurements));

		// Delete an observation
		$OBSERVATION_FACTORY->deleteObservation($editobs);
		$deleteobs = $observation = $OBSERVATION_FACTORY->
				getObservation($editobs->id);
		notify('Delete an observation', null, $deleteobs);
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

