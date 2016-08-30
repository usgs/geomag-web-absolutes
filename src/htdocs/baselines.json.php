<?php

include_once '../conf/config.inc.php';
include_once '../lib/classes/BaselinesWebService.class.php';


if (!isset($TEMPLATE)) {
  if (count($_GET) > 0) {
    // any parameters = run service
    $service = new BaselinesWebService($DB);
    $service->run($_GET);
    exit();
  }

  $TITLE = 'Geomag Web Absolutes Web Service documentation';
  include 'template.inc.php';
}


?>

<p>TODO: documentation goes here.</p>
