<?php

include_once '../conf/config.inc.php';

// process request
try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
	// throw new Exception('foo');
	$json = str_replace('\"', '"', json_encode($OBSERVATORY_FACTORY->
			getObservatories()));
	if (isset($_REQUEST['callback'])) {
		header('Content-Type: text/javascript');
		echo $_REQUEST['callback'] . '(' . $json . ');';
	} else {
		header('Content-Type: application/json');	
		echo $json;
	}
} catch (Exception $e) {
	// fail noisily
	header('HTTP/1.1 500 Internal Server Error');

	// log the error
	error_log($e->getMessage());

	exit();
}

