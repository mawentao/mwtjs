/**
 * tree
 **/

MWT.Tree=function(opt)
{
    this.listeners={};
    this.root;

    this.render=null;
    this.showRoot = false;	
    if (opt)
	{
		if (isset(opt.showRoot)) this.showRoot=opt.showRoot;
		if (isset(opt.render)) this.render=opt.render;
	}

    ////////////////////////////////////////////////////////////
    // 判断是否是叶子节点
    function isLeaf(node){return !isset(node.children);};
    // 判断枝节点是否展开
    function isExpand(node){
        if(isLeaf(node)) return false;
        if(isset(node.expand) && !node.expand) return false;
        return true;
    };

    // toggle 枝节点
    this.togglenode = function() {
        var sub_tree_id = "sub-tree-"+jQuery(this).data("sub-tree");
        if (jQuery(this).hasClass("folder")) {
			jQuery(this).removeClass("folder");
			jQuery(this).addClass("folder-open");
			jQuery("#"+sub_tree_id).show();
		} else {
			jQuery(this).removeClass("folder-open");
			jQuery(this).addClass("folder");
			jQuery("#"+sub_tree_id).hide();
		}
    };

    ////////////////////////////////////////////////////////////

    // 加载本地数据
    this.load=function(root)
    {
        this.root = root;
        var prefixcode = "";
        var code = "<ul class='mwt-tree'>";
        if (this.showRoot) {
            code += this.display_tree_node(root, prefixcode);
        } else if (isset(root.children)) {
            for (var i=0; i<root.children.length; ++i) {
                code +=  this.display_tree_node(root.children[i], prefixcode);
            }
        }
        code += "</ul>";
        set_html(this.render, code);

        var thiso = this;
        jQuery(".folder").click(thiso.togglenode);
        jQuery(".folder-open").click(thiso.togglenode);
        jQuery(".tree-node").click(function(){
            thiso.click_node(jQuery(this).data("node-id"));
        });
    };

    this.display_tree_node=function(node,prefix_code)
    {
        var code="<li>"+
                 this.get_tree_node_prefix(prefix_code, node)+
                 this.get_tree_node(node);
        if (isset(node.children)) {
			var hide="";
			if(!isExpand(node)) hide="display:none";
            code += "<ul class='mwt-tree' id='sub-tree-"+node.node_id+"' style='"+hide+"'>";
            var pc = prefix_code+"<span style='padding-left:15px;'></span>";
            for (var i=0; i<node.children.length; ++i) {
                code += this.display_tree_node(node.children[i], pc);
            }
            code += "</ul>";
        }
        code += "</li>";
        return code;
    };

    this.get_tree_node_prefix = function(prefix_code, node) {
        var cls = "folder-open";
        if(isLeaf(node))cls="leaf";
        else if (!isExpand(node)) {cls="folder";}
        return prefix_code+"<i class='icon "+cls+"' data-sub-tree='"+node.node_id+"'></i>"; 
    };

    this.get_tree_node = function(node) {
        var code="<a href='javascript:void(0);' class='tree-node' id='tn-"+node.node_id+"' "+
                 "data-node-id='"+node.node_id+"' data-node-value='"+node.node_value+"'>"+node.node_name+"</a>";
        return code;
    };

    // 点击节点
    this.click_node = function(node_id) 
    {
        var sel = jQuery("#tn-"+node_id);
		var param = {
			"node_id":node_id,
			"node_name":sel.html(),
			"node_value":sel.data("node-value")
		};
		this.clicked_node=param;
		this.fire("click-node");
    };

    // 全部折叠
    this.fold = function(){this.toggle(0);};

    // 全部展开
    this.unfold = function(){this.toggle(1);};    

    // 折叠or展开
    this.toggle = function(mode) {
        var data=this.root;
        for (var i=0;i<data.children.length;++i) {
            var nodeid = data.children[i].node_id;
            $subtree = jQuery("#sub-tree-"+nodeid);
            $icon = jQuery("[data-sub-tree='"+nodeid+"']");
            if (mode==0) {
                $icon.removeClass("folder-open");
                $icon.addClass("folder");
                $subtree.hide();
            } else {
                $icon.removeClass("folder");
                $icon.addClass("folder-open");
                $subtree.show();
            }
        }
    };
};
MWT.extends(MWT.Tree, MWT.Event);
