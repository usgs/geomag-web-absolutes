<?php

if (!isset($_REQUEST['id'])) {
	header('HTTP/1.1 400 Bad Request');
	echo 'id is required';
	exit();
}
$id = intval($_REQUEST['id']);
if ($id <= 0) {
	header('HTTP/1.1 400 Bad Request');
	echo 'id must be a positive integer';
	exit();
}

// load config after ensuring required parameter is present
include_once '../conf/config.inc.php';
include '../lib/login.inc.php';

// process request
try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
	// throw new Exception('foo');
	$json = str_replace('\"', '"', json_encode($OBSERVATORY_FACTORY->
			getObservatory($id)));
	if (isset($_REQUEST['callback'])) {
		header('Content-Type: text/javascript');
		echo $_REQUEST['callback'] . '(' . $json . ');';
	}
	else {
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

