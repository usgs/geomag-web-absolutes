<?php

// configure session storage
include_once '../conf/config.inc.php';

// destroy session data
session_start();
$_SESSION = array();
session_destroy();

// send to main page
header('Location: ' . $MOUNT_PATH . '/index.php');
