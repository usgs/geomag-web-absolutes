<?php

// load configuration if not already loaded.
include_once('../conf/config.inc.php');

// pages using authentication shouldn't be cached.
header('Cache-Control:no-cache, no-store');

// keep inactive sessions for 8 hours
ini_set("session.gc_maxlifetime", "28800");
// keep cookie until browser closes
ini_set("session.cookie_lifetime", "0");
session_start();

// load user from session.
$CURRENT_USER = $USER_FACTORY->getCurrentUser();
session_write_close();

if ($CURRENT_USER === null) {
  // not logged in, send to login page
  header('Location: ' . $MOUNT_PATH . '/login.php');
  exit();
} else {
  // logged in, define user for js.
  $FOOT = '<script>' .
      'var CurrentUser = ' . json_encode($CURRENT_USER) . ';' .
      '</script>' .
      (isset($FOOT) ? $FOOT : '');
}

?>
