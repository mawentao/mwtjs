<?php

/***********************************************************
 * @file:   save.php
 * @author: mawentao(mawentao@baidu.com)
 * @create: 2015-03-21 21:35:35
 * @modify: 2015-03-21 21:35:35
 * @brief:  save.php
 ***********************************************************/

define("CUR_PATH", realpath(dirname(__FILE__)));

$tmpfile = CUR_PATH."/../demos/tmp/tmp.html";
$fp = fopen($tmpfile, "w");
if ($fp) {
    $data = urldecode($_REQUEST["txt"]);
	$data = str_replace("\\\"", "\"", $data);
	$data = str_replace("\\'", "'", $data);

	fwrite($fp, $data);
	fclose($fp);
	echo "demos/tmp/tmp.html";
}else{
	echo "0";
}


// vim600: sw=4 ts=4 fdm=marker syn=php
?>
