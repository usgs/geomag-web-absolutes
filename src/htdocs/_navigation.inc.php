<?php

include_once '../conf/config.inc.php';

$userLoggedIn = true; // isset($_SESSION['username']);

if ($userLoggedIn) {
	print
		navItem($MOUNT_PATH . '/index.php', 'Dashboard') .
		navItem($MOUNT_PATH . '/observation/', 'Add Observation');

	$userIsAdmin = true; // ($_SESSION['role'] === 'admin');
	if ($userIsAdmin) {
		print navItem($MOUNT_PATH . '/accounts/', 'Administer Users');
	}

	print navItem($MOUNT_PATH . '/logout/', 'Logout');
} else {
	print navItem($MOUNT_PATH . '/login/', 'Login');
}