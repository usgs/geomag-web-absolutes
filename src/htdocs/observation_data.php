<?php

if (!isset($TEMPLATE)) {
	include_once '../conf/config.inc.php';
	include '../lib/login.inc.php';
	include_once 'functions.inc.php';
}

$id = param('id', null);
if ($id !== null) {
	$id = intval($id, 10);
}

// POST,GET,PUT,DELETE => Create,Read,Update,Delete
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] :
		 'GET';
$isAdmin = ($CURRENT_USER['admin'] === 'Y');
$defaultObservatoryId = intval($CURRENT_USER['default_observatory_id']);

// process request
try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
	//throw new Exception('foo');
	if ($method === 'GET') {
		// validate id parameter
		if (!isset($_GET['id'])) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id is a required parameter';
			exit();
		}
		$id = intval($_GET['id']);
		if ($id <= 0) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id must be a positive integer';
			exit();
		}
		// find matching observation
		$observation = $OBSERVATION_FACTORY->getObservation($id);
		if ($observation === null) {
			header('HTTP/1.1 404 Not Found');
			echo 'no matching observation found';
			exit();
		}
		// serve response
		$json = str_replace('\"', '"', json_encode($observation));
		if (isset($_REQUEST['callback'])) {
			header('Content-Type: text/javascript');
			echo $_REQUEST['callback'] . '(' . $json . ');';
		}
		else {
			header('Content-Type: application/json');
			echo $json;
		}
	} else if ($method === 'DELETE') {
		if (!$isAdmin) {
			// only admin can delete
			header('HTTP/1.1 403 Forbidden');
			echo 'only admin users can delete observations';
			exit();
		}
		// php doesn't populate $_POST when method is DELETE.
		$params = array();
		parse_str(file_get_contents('php://input'), $params);
		// validate id parameter
		if (!isset($params['id'])) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id is a required parameter';
			exit();
		}
		$id = intval($params['id']);
		if ($id <= 0) {
			header('HTTP/1.1 400 Bad Request');
			echo 'id must be a positive integer';
			exit();
		}
		// find matching observation
		$observation = $OBSERVATION_FACTORY->getObservation($id);
		if ($observation === null) {
			header('HTTP/1.1 400 Bad Request');
			echo 'no matching observation found';
			exit();
		}
		// delete
		$OBSERVATION_FACTORY->deleteObservation($observation);
		// notify it worked
		echo 'deleted';
	} else {

		// read json from client
		$json = file_get_contents('php://input');
		$json = json_decode($json, true /* associative */);
		$observation = ObservationDetail::fromArray($json);

		if ($method === 'POST') {
			// create
			if ($observation->id !== null) {
				header('HTTP/1.1 400 Bad Request');
				echo 'cannot create an observation that already has an id';
				exit();
			}
			if ($observation->observatory_id === null) {
				header('HTTP/1.1 400 Bad Request');
				echo 'cannot create an observation without an observatory';
				exit();
			}
			$observation = $OBSERVATION_FACTORY->createObservation($observation);
		} else if ($method === 'PUT') {
			// update
			if ($observation->id === null) {
				header('HTTP/1.1 400 Bad Request');
				echo 'cannot update an observation without an id';
				exit();
			}
			$observation = $OBSERVATION_FACTORY->updateObservation($observation);
		} else {
				header('HTTP/1.1 405 Method not allowed');
				echo 'unsupported HTTP method';
				exit();
		}

		// output resulting observation
		$json = str_replace('\"', '"', json_encode($observation));
		header('Content-Type: application/json');
		echo $json;
	}
} catch (Exception $e) {
	// fail noisily
	header('HTTP/1.1 500 Internal Server Error');

	// log the error
	error_log($e->getMessage());
	echo $e->getMessage();

	exit();
}
