<?php
if (!isset($TEMPLATE)) {
	include_once '../conf/config.inc.php';
	include_once 'functions.inc.php';
	include '../lib/login.inc.php';
	include 'template.inc.php';

	if ($CURRENT_USERS['admin'] !== 'Y') {
		header('HTTP/1.1 403 Forbiden');
		echo 'Only admin users may view or change user data.';
		exit();
	}

	$TITLE = 'User Admin';

	$NAVIGATION = true;
	$HEAD = '<link rel="stylesheet" href="'.$MOUNT_PATH.'/css/useradmin.css"/>';
	$FOOT =
		'<script>
			var MOUNT_PATH = \'' . $MOUNT_PATH .'\';
		</script>' .
		'<script src="' . $MOUNT_PATH . '/js/useradmin.js"></script>' .
		'<script src="http://localhost:35729/livereload.js?snipver=1"></script>';
}
?>

<div class="user-admin-view-wrapper"></div>