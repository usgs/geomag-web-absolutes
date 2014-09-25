<?php

$navItems = '';

if (isset($CURRENT_USER)) {
	$navItems .=
		navItem($MOUNT_PATH . '/index.php', 'Dashboard') .
		navItem($MOUNT_PATH . '/observation/', 'Observation Input');

	if ($CURRENT_USER['admin'] === 'Y') {
		$navItems .= navItem($MOUNT_PATH . '/useradmin.php', 'Administer Users');
	}

	$navItems .= navItem($MOUNT_PATH . '/logout.php', 'Logout');
} else {
	$navItems .= navItem($MOUNT_PATH . '/login.php', 'Login');
}

print navGroup('Web Absolutes', $navItems);
