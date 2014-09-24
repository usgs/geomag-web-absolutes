<?php


include_once 'config.inc.php';

$MAGPROCDB = new PDO($CONFIG['MAGPROC_DSN'], $CONFIG['MAGPROC_USER'],
			$CONFIG['MAGPROC_PASS']);

$MAGPROC_FACTORY = new MagProcPublisher($MAGPROCDB);
