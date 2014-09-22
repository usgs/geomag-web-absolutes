<?php

// load configuration if not already loaded.
include_once('../conf/config.inc.php');

// pages using authentication shouldn't be cached.
header('Cache-Control:no-cache, no-store');
session_start();

// load user from session.
$currentUser = $USER_FACTORY->getCurrentUser();
if ($currentUser === null) {
	// not logged in, send to login page
	header('Location: ' . $MOUNT_PATH . '/login.php');
	exit();
} else {
	// logged in, define user for js.
	$FOOT = '<script>' .
			'define("geomag/User", ' . json_encode($currentUser) . ');' .
			'</script>' .
			(isset($FOOT) ? $FOOT : '');
}

?>
