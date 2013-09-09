<?php

include_once '../conf/config.inc.php';

// POST,GET,PUT,DELETE => Create,Read,Update,Delete
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] :
		 'GET';

// id is used for get, update, delete
$id = 0;
if (isset($_REQUEST['id'])) {
	$id = intval($_REQUEST['id']);
}

// process request
try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
	//throw new Exception('foo');
	if ($method == 'GET') {
		if ($id <= 0) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id must be a positive integer';
			exit();
		}
		$json = str_replace('\"', '"', json_encode($OBSERVATION_FACTORY->
				getObservation($id)));
		if (isset($_REQUEST['callback'])) {
			header('Content-Type: text/javascript');
			echo $_REQUEST['callback'] . '(' . $json . ');';
		}
		else {
			header('Content-Type: application/json');
			echo $json;
		}
	} else if ($method == 'DELETE') {
		if ($id <= 0) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id must be a positive integer';
			exit();
		}
	} else {
		// read json from client
		$json = file_get_contents('php://input');
		if ($method == 'POST') {
		} else if ($method == 'PUT') {
		}
	}
} catch (Exception $e) {
	// fail noisily
	header('HTTP/1.1 500 Internal Server Error');

	// log the error
	error_log($e->getMessage());

	exit();
}
