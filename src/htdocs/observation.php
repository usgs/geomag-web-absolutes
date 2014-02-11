<?php
if (!isset($TEMPLATE)) {
	include_once 'functions.inc.php';

	$id = param('id', 'null');
	if ($id !== 'null') {
		$id = intval($id, 10);
	}

	$TITLE = 'Observation Input';

	$HEAD = '<link rel="stylesheet" href="css/observation.css"/>';
	$FOOT = 
		'<script>var observationId = ' . $id . ';</script>' .
		'<script src="js/observation.js"></script>' .
		'<script src="http://localhost:35729/livereload.js?snipver=1"></script>';

	include 'template.inc.php';
}
?>

<div class="observation-view-wrapper"></div>
