<?php

// load config after ensuring required parameter is present
include_once '../conf/config.inc.php';


// process request
header('Content-Type: application/json');

try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
    // throw new Exception('foo');

	echo json_encode($OBSERVATORY_FACTORY->getObservatories());

} catch (Exception $e) {
	// fail noisily
	header('HTTP/1.1 500 Internal Server Error');
	//echo '{"error": "'.$e->getMessage().'"}';//"Unable to process request"}';
	echo '{"error": "Unable to process request"}';
	echo $e;
	// log the error
	error_log($e->getMessage());

	exit();
}

