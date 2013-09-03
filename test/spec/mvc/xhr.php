<?php
if (isset($_GET['callback'])) {
	header('Content-type: text/javascript');
	echo $_GET['callback'] . '(';
} else {
	header('Content-type: application/json');
}
?>
{
	"method": "<?php echo $_SERVER['REQUEST_METHOD']; ?>",
	"postdata": "<?php echo str_replace('"', '\"', file_get_contents("php://input")); ?>",
	"testkey": "testvalue",
	"testkey2": "testvalue2"
}
<?php
if (isset($_GET['callback'])) {
	echo ');';
}
?>
