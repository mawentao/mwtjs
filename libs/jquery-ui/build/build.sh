#!/bin/bash

####################################################
# @file:   build.sh
# @author: mawentao
# @create: 2016-05-16 18:09:42
# @modify: 2016-05-16 18:09:42
# @brief:  build.sh
####################################################

product=jquery-ui
output=../
src=./
#jqueryui=./jquery-ui-1.11.4.custom-redmond
jqueryui=./jquery-ui-1.11.4.custom-smoothness
#jqueryui=./jquery-ui-1.11.4.custom-lightness

if [ ! -d $output ];then
    mkdir $output
fi

function mergejs()
{
    file=$product".min.js"
    uglifyjs $@ -m -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file
}

function mergecss()
{
	file=$product".min.css"
    cleancss $@ --s0 --skip-rebase -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file   
}


mergejs \
$jqueryui/jquery-ui.min.js \
$src/jquery-ui-timepicker/*.js \
$src/jquery-ui-timepicker/i18n/jquery-ui-timepicker-addon-i18n.min.js \
$src/jquery-ui-timepicker/i18n/jquery-ui-timepicker-zh-CN.js \
$src/jquery-ui-zh.js 

mergecss \
$jqueryui/jquery-ui.min.css \
$jqueryui/jquery-ui.theme.min.css \
$src/jquery-ui-timepicker/*.css \
$src/jquery-ui-mine.css


rm -rf $output/images
cp -r $jqueryui/images $output


echo '!!!THE END!!!'

exit 0
