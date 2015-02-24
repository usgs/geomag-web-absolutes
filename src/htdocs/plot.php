<?php
if (!isset($TEMPLATE)) {
  include_once '../conf/config.inc.php';
  include_once 'functions.inc.php';

  $id = param('id', 'null');
  if ($id !== 'null') {
    $id = intval($id, 10);
  }

  $TITLE = 'Baseline Plot';
  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="' . $MOUNT_PATH . '/css/plot.css"/>
  ';

  $FOOT = '
    <script>
      var observationId = ' . $id . ';
      var MOUNT_PATH = \'' . $MOUNT_PATH . '\';
    </script>
    <script src="' . $MOUNT_PATH . '/js/plot.js"></script>
  ';

  include '../lib/login.inc.php';

  if ($CURRENT_USER['admin'] !== 'Y') {
    header('HTTP/1.1 403 Forbiden');
    echo 'Only admin users may view baseline data.';
    exit();
  }

  include 'template.inc.php';
}
?>

<div class="observation-baseline-plot-wrapper"></div>
