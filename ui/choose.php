<?php


define("CUR_PATH", realpath(dirname(__FILE__)));

$f = $_GET["f"];
$filename = CUR_PATH."/../$f";


$fp = fopen($filename, "r");
$ret = fread($fp, filesize($filename));
fclose($fp);
echo $ret;

?>
