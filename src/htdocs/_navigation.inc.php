<?php

$navItems = '';

if (isset($CURRENT_USER)) {

  if (isset($CURRENT_USER['default_observatory_id'])) {
    $observatoryId = '#' . $CURRENT_USER['default_observatory_id'];
  } else {
    $observatoryId = '';
  }

  $navItems .=
    navItem($MOUNT_PATH . '/index.php', 'Dashboard') .
    navItem($MOUNT_PATH . '/observation/' . $observatoryId,
        'Observation Input');

  if ($CURRENT_USER['admin'] === 'Y') {
    $navItems .= navItem($MOUNT_PATH . '/useradmin.php', 'Administer Users');
  }

  $navItems .= navItem($MOUNT_PATH . '/logout.php', 'Logout');
} else {
  $navItems .= navItem($MOUNT_PATH . '/login.php', 'Login');
}

print navGroup('Web Absolutes', $navItems);
