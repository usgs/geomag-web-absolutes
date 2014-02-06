<?php
if (!isset($TEMPLATE)) {
	$TITLE = 'Observation Input';

	$HEAD = '<link rel="stylesheet" href="css/observation.css"/>';
	$FOOT = '
		<script src="js/observation.js"></script>
		<script src="http://localhost:35729/livereload.js?snipver=1"></script>
	';

	include 'template.inc.php';
}
?>

<div class="observation-view-wrapper"></div>
