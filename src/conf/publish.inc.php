<?php

include_once '../conf/config.inc.php';

$MAGPROCDB = new PDO($CONFIG['MAGPROC_DSN'], $CONFIG['MAGPROC_USER'],
			$CONFIG['MAGPROC_PASS']);

$MAGPROC_FACTORY = new MagProcPublisher($MAGPROCDB);
