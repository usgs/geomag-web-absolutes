<?php

if (!function_exists("safefloatval")) {
	function safefloatval($value=null) {
		if ($value === null) {
			return null;
		} else {
			return floatval($value);
		}
	}
}

if (!function_exists("safeintval")) {
	function safeintval($value=null) {
		if ($value === null) {
			return null;
		} else {
			return intval($value);
		}
	}
}


// PHP Classes
$classDir = $APP_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'classes' . DIRECTORY_SEPARATOR;

include_once $classDir . 'Instrument.class.php';
include_once $classDir . 'Mark.class.php';
include_once $classDir . 'Measurement.class.php';
include_once $classDir . 'Observation.class.php';
include_once $classDir . 'ObservationDetail.class.php';
include_once $classDir . 'ObservationFactory.class.php';
include_once $classDir . 'Observatory.class.php';
include_once $classDir . 'ObservatoryDetail.class.php';
include_once $classDir . 'ObservatoryFactory.class.php';
include_once $classDir . 'Pier.class.php';
include_once $classDir . 'Reading.class.php';

include_once $classDir . 'PdoSessionHandler.php';