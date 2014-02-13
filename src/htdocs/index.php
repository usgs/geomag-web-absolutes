<?php
if (!isset($TEMPLATE)) {
	include_once '../conf/config.inc.php';
	include_once 'functions.inc.php';

	$TITLE = 'Observatories';

	$HEAD = '<link rel="stylesheet" href="' . $MOUNT_PATH . '/css/index.css"/>';
	$FOOT =
		'<script>
			var MOUNT_PATH = \'' . $MOUNT_PATH .'\';
		</script>' .
		'<script src="requirejs/require.js" data-main="' . $MOUNT_PATH . '/js/index.js"></script>';

	include 'template.inc.php';
}
?>

<div class="observatoryView"></div>


