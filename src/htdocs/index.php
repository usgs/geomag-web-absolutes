<?php
if (!isset($TEMPLATE)) {
	include_once '../conf/config.inc.php';
	include_once 'functions.inc.php';

	$TITLE = 'Dashboard';

	$NAVIGATION = true;
	$HEAD = '<link rel="stylesheet" href="' . $MOUNT_PATH . '/css/index.css"/>';
	$FOOT =
		'<script>
			var MOUNT_PATH = \'' . $MOUNT_PATH .'\';
		</script>' .
		'<script src="' . $MOUNT_PATH . '/js/index.js"></script>';

	include 'template.inc.php';
}
?>

<div class="observatory-view"></div>


