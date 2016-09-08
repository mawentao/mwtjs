<?php

$data = array(
	"totalProperty" => 100,
	"root" => array(),
);


// 构造数据
$db = array();
for ($i=1; $i<=$data["totalProperty"]; ++$i) {
	$db[] = array (
		"id" => $i,
		"name" => "name".$i,
		"sex" => $i % 2,
	);
}
$sort_id = array();
$sort_name = array();
$sort_sex = array();
function map_attribute(&$arr)
{
    global $sort_id, $sort_name, $sort_sex;
    foreach ($arr as $key => &$value) {
        $sort_id[$key] = $value["id"];
        $sort_name[$key] = $value["name"];
        $sort_sex[$key] = $value["sex"];
    }
}
map_attribute($db);

// 排序
$sort = $_REQUEST["sort"];
$dir = $_REQUEST["dir"] == "DESC" ? SORT_DESC : SORT_ASC;
if ($sort == "name")
	array_multisort($sort_name, $dir,$db);
else if ($sort == "sex")
	array_multisort($sort_sex, $dir,$db);
else
	array_multisort($sort_id, $dir,$db);


// 分页
$start = $_REQUEST["start"];
$limit = $_REQUEST["limit"];
$data["root"] = array_slice($db, $start, $limit);

echo json_encode(array("data"=>$data));

?>
