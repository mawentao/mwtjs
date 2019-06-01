#!/bin/bash

####################################################
# @file:   LangUI打包脚本
# @author: mawentao
# @create: 2017-08-02 14:12:52
# @modify: 2017-08-02 14:12:52
####################################################

PRODUCT='mwt'
VERSION='4.0'
OUTDIR="./output"
BUILD_DATE=`date +"%Y-%m-%d %H:%M:%S"`
NOWYEAR=`date +"%Y"`

# 打包文件
function tarfiles()
{
	targetdir="$OUTDIR/$PRODUCT/$VERSION"
    if [ ! -d $targetdir ];then
		mkdir -p $targetdir
    fi
    for f in $@; do
		sed -i "s/MWT_VERSION/$VERSION/g" dist/$f
		sed -i "1i\\
/*! $f v$VERSION | (c) 2013-$NOWYEAR | release:$BUILD_DATE */
" dist/$f
		cp -r dist/$f $targetdir
    done
}

# 创建输出目录
if [ ! -d $OUTDIR ];then
    mkdir $OUTDIR
fi
# 编译
npm run build
# 打包文件
tarfiles $PRODUCT.min.js $PRODUCT.min.css $PRODUCT"_mobile.min.js" $PRODUCT"_mobile.min.css"
cp -r dist/fonts $targetdir
cd $OUTDIR; zip -r $PRODUCT-$VERSION.zip $PRODUCT/*; cd ..

echo '!!!BUILD SUCCESS!!!'
exit 0
