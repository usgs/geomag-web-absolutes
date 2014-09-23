<?php

include_once '../conf/config.inc.php';

// $currentUser = $USER_FACTORY->getCurrentUser();
$userLoggedIn = true; // ($currentUser !== null); // ???
$navItems = '';

if ($userLoggedIn) {
	$navItems .=
		navItem($MOUNT_PATH . '/index.php', 'Dashboard') .
		navItem($MOUNT_PATH . '/observation/', 'Observation Input');

	$userIsAdmin = true; // $user->inRole('admin'); // ???
	if ($userIsAdmin) {
		$navItems .= navItem($MOUNT_PATH . '/accounts/', 'Administer Users');
	}

	$navItems .= navItem($MOUNT_PATH . '/logout.php', 'Logout');
} else {
	$navItems .= navItem($MOUNT_PATH . '/login.php', 'Login');
}

print navGroup('Web Absolutes', $navItems);