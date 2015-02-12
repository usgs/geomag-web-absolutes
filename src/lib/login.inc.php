<?php

// load configuration if not already loaded.
include_once('../conf/config.inc.php');

// pages using authentication shouldn't be cached.
header('Cache-Control:no-cache, no-store');
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
      'define("CurrentUser", ' . json_encode($CURRENT_USER) . ');' .
      '</script>' .
      (isset($FOOT) ? $FOOT : '');
}

?>
