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

// process request
try {
	// 09/04/12 -- EMM: This exception is for testing client-side error handling.
	//                  Remove it for production.
	//throw new Exception('foo');
	if ($method === 'GET') {
		// validate id parameter
		if (!isset($_GET['id'])) {
			header('HTTP/1.1 400 Bad Request');
			echo 'user id is a required parameter';
			exit();
		}

		$id = intval($_GET['id']);
		if ($id <= 0) {
			$user = $USER_FACTORY->getAllUsers();
		} else {
			$user = $USER_FACTORY->getUser();
		}

		// find matching observation
		if ($user === null) {
			header('HTTP/1.1 404 Not Found');
			echo 'no matching user id found';
			exit();
		}
		// serve response
		$json = str_replace('\"', '"', json_encode($user));
		if (isset($_REQUEST['callback'])) {
			header('Content-Type: text/javascript');
			echo $_REQUEST['callback'] . '(' . $json . ');';
		}
		else {
			header('Content-Type: application/json');
			echo $json;
		}
	} else if ($method === 'DELETE') {
		// php doesn't populate $_POST when method is DELETE.
		$params = array();
		parse_str(file_get_contents('php://input'), $params);
		// validate id parameter
		if (!isset($params['id'])) {
			header('HTTP/1.1 400 Bad Request');
			echo 'user id is a required parameter';
			exit();
		}

		$id = intval($params['id']);
		if ($id <= 0) {
			header('HTTP/1.1 400 Bad Request');
			echo 'user id must be a positive integer';
			exit();
		}

		// find matching observation
		$user = $USER_FACTORY->getUser($id);
		if ($user === null) {
			header('HTTP/1.1 400 Bad Request');
			echo 'no matching user id found';
			exit();
		}
		// delete
		$USER_FACTORY->deleteUser($user);
		// notify it worked
		echo 'deleted';
	} else {

		// read json from client
		$json = file_get_contents('php://input');
		$json = json_decode($json, true /* associative */);
		$user = $json; //User::fromArray($json);

		if ($method === 'POST') {
			// create
			if ($user['id'] !== null) {
				header('HTTP/1.1 400 Bad Request');
				echo 'cannot create an user that already has an id';
				exit();
			}
			$user = $USER_FACTORY->createUser($user);
		} else if ($method === 'PUT') {
			// update
			if ($user['id'] === null) {
				header('HTTP/1.1 400 Bad Request');
				echo 'cannot update an user without an user id';
				exit();
			}
			$user = $USER_FACTORY->updateUser($user);
		} else {
				header('HTTP/1.1 405 Method not allowed');
				echo 'unsupported HTTP method';
				exit();
		}

		// output resulting observation
		$json = str_replace('\"', '"', json_encode($user));
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