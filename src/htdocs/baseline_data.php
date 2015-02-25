<?php

include_once '../conf/config.inc.php';
include_once '../lib/login.inc.php';
include_once 'functions.inc.php';


$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] :
    'GET';
$isAdmin = ($CURRENT_USER['admin'] === 'Y');


try {

  if (!$isAdmin) {
    header('HTTP/1.1 403 Forbidden');
    echo 'Only admin users can view baseline data.';
    exit();
  } else if ($method === 'GET') {
    if (!isset($_GET['observatoryId'])) {
      header('HTTP/1.1 400 Bad Request');
      echo 'observatoryId is a required parameter';
      exit();
    }
    if (!isset($_GET['startTime'])) {
      header('HTTP/1.1 400 Bad Request');
      echo 'startTime is a required paramter';
      exit();
    }
    if (!isset($_GET['endTime'])) {
      header('HTTP/1.1 400 Bad Request');
      echo 'endTime is a required parameter';
      exit();
    }

    $observatoryId = intval($_GET['observatoryId']);

    // Note: Expect start/end times in seconds since epoch
    $startTime = intval($_GET['startTime']);
    $endTime = intval($_GET['endTime']);

    if ($observatoryId <= 0) {
      header('HTTP/1.1 400 Bad Request');
      echo 'observatoryId must be a positive integer';
      exit();
    }

    if ($endTime <= $startTime) {
      header('HTTP/1.1 400 Bad Request');
      echo 'endTime must be later than startTime';
    }

    $baselines = $OBSERVATORY_FACTORY->getBaselines($observatoryId, $startTime,
        $endTime);

    if (count($baselines) < 1) {
      header('HTTP/1.1 404 Not Found');
      echo 'No matching observations found.';
      exit();
    }

    $json = str_replace('\"', '"', json_encode($baselines));
    if (isset($_REQUEST['callback'])) {
      header('Content-Type: text/javascript');
      echo $_REQUEST['callback'] . '(' . $json . ');';
    } else {
      header('Content-Type: application/json');
      echo $json;
    }
  } else {
    header('HTTP/1.1 405 Method not allowed');
    header('Allow: GET');
    echo ('unsupported HTTP method');
    exit();
  }
} catch (Exception $e) {
  header('HTTP/1.1 500 Internal Server Error');

  error_log($e->getMessage());
  echo $e->getMessage();

  exit();
}
