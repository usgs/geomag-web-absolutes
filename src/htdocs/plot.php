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
      var observatoryId = ' . $id . ';
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

<p class="alert warning">
  Showing the past 13 months of baseline observations for the currently
  selected observatory. Updating plots can take a small amount of time,
  please be patient and do not rapidly switch between observatories since
  this may result in seeing unexpected data.
</p>

<div class="observation-baseline-plot-wrapper">
  <section class="observatory-select-view">
    <h2>Observatory</h2>
    <select class="observatory-select-box"></select>
  </section>

  <section class="observation-baseline-plot-view"></section>
</div>
