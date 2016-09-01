<?php

include_once '../conf/config.inc.php';
include_once '../conf/publish.inc.php';
include_once 'functions.inc.php';

include_once '../lib/login.inc.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('HTTP/1.1 400 Bad Request');
  echo 'Should only post to publish.';
  exit();
}

$observationId = param('id', null);
try {
  $observation = $OBSERVATION_FACTORY->getObservation($observationId);
  $observatory = $OBSERVATORY_FACTORY->getObservatory(
      $observation->observatory_id);
  $observer = $USER_FACTORY->getUser($observation->observer_user_id);
  $reviewer = $CURRENT_USER;

  if ($reviewer['admin'] === 'Y') {
    $observation->reviewer_user_id = $reviewer['id'];
    $observation->reviewed = 'Y';
    $OBSERVATION_FACTORY->updateObservation($observation);
    header('Content-Type: application/json');
    echo str_replace('\"', '"',json_encode($observation));
  } else {
    header('HTTP/1.1 401 Unauthorized');
    echo 'Current user is not allowed to publish calibration data.';
  }
} catch (Exception $e) {
  header('HTTP/1.1 500 Internal Server Error');
  // log the error
  error_log($e->getMessage());
  echo $e->getMessage();
}

exit();
