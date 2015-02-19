<?php
if (!isset($TEMPLATE)) {
	include_once '../conf/config.inc.php';
	include_once 'functions.inc.php';

	$id = param('id', 'null');
	if ($id !== 'null') {
		$id = intval($id, 10);
	}

	$TITLE = 'Observation Input';

	$NAVIGATION = true;
	$HEAD = '<link rel="stylesheet" href="'.$MOUNT_PATH.'/css/observation.css"/><script src="requirejs/require.js"></script>';
	$FOOT =
		'<script>
			var observationId = ' . $id . ';
			var MOUNT_PATH = \'' . $MOUNT_PATH . '\';
			var REALTIME_DATA_URL = \'' . $REALTIME_DATA_URL . '\';
		</script>' .
		'<script src="' . $MOUNT_PATH . '/js/observation.js"></script>' .
		'<script src="http://localhost:35729/livereload.js?snipver=1"></script>';

	include '../lib/login.inc.php';
	include 'template.inc.php';
}
?>

<div class="observation-view-wrapper"></div>
