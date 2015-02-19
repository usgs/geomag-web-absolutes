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

    $observations = $OBSERVATORY_FACTORY->getObservatory($id)->observations;

    if (count($observations) < 1) {
      header('HTTP/1.1 404 Not Found');
      echo 'No matching observations found.';
      exit();
    }

    $baselines = array();

    foreach ($observations as $observation) {
      $baseline = array(
        'observation' => $observation->id,
        'dateTime' => $observation->begin,
        'baseH' => array(),
        'baseZ' => array(),
        'baseD' => array()
      );

      $readings = $OBSERVATION_FACTORY->getObservation($observation->id)->readings;

      foreach ($readings as $reading) {
        if ($reading->horizontal_intensity_valid === 'Y') {
          $baseline['baseH'][] = safefloatval($reading->baseH);
        }
        if ($reading->vertical_intensity_valid === 'Y') {
          $baseline['baseZ'][] = safefloatval($reading->baseZ);
        }
        if ($reading->declination_valid === 'Y') {
          $baseline['baseD'][] = safefloatval($reading->baseD);
        }
      }

      $baselines[] = $baseline;
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