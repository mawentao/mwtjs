/**
 * 表单
 */

MWT.Form = function(opt)
{
	this.listeners = {};
	this.item = {};
	this.render = null;
    this.labelWidth = 80;
	var items = [];
	var formid = "";
	if (opt) {
		if (opt.render) {
			this.render=opt.render;
			formid=this.render+"-fm";
		}
		if (opt.items) items=opt.items;
        if (opt.labelWidth) this.labelWidth=opt.labelWidth;
	}

	////////////////////////////////////////////////
	// 处理hidden
	function get_hidden_code(item)
	{
		var value = item.value ? item.value : "";
		return "<input name='"+item.name+"' type='hidden' value='"+value+"'>";
	}
	
	// 处理text,textarea
	function get_text_code(item)
	{
		var style = item.style ? "style=\""+item.style+"\"" : "";
		var value = item.value ? item.value : "";
		return "<input name='"+item.name+"' type='text' class='form-control' "+style+" value='"+value+"'>";
	}
	function get_textarea_code(item)
	{
		var style = item.style ? "style=\""+item.style+"\"" : "";
		var value = item.value ? item.value : "";
		return "<textarea name='"+item.name+"' class='form-control' "+style+">"+value+"</textarea>";
	}
	function get_text_value(item)
	{
		var name = item.name;
		var formdom = document.getElementById(formid);
		var value = formdom[name].value.trim();
		formdom[name].value = value;
		if (value == "") {
			if (item.errmsg) {
				document.getElementById(name+"-errmsg").innerHTML = item.errmsg;
			}
			formdom[name].focus();
			throw new Error(name+" is empty");
		}
		return value;
	}
	function reset_text_value(item) {
		var value = item.value ? item.value : "";
		var formdom = document.getElementById(formid);
		formdom[item.name].value = value;
	}
	function set_text_value(item, record) {
		if (record[item.name]) {
			var formdom = document.getElementById(formid);
			formdom[item.name].value = record[item.name];
		}
	}

	// 处理select
	function get_select_code(item) {
		var style = item.style ? "style=\""+item.style+"\"" : "";
		var value = item.value ? item.value : "";
		var code = "<select name='"+item.name+"' class='form-control' "+style+">";
		for (var i=0; i<item.options.length; ++i) {
			var selected = item.options[i].value==item.value ? "selected" : "";
			code += "<option value='"+item.options[i].value+"' "+selected+">"+item.options[i].text+"</option>";
		}
		code += "</select>";
		return code;
	}
	function get_select_value(item) {
		var formdom = document.getElementById(formid);
		var sel = formdom[item.name];
		return sel.options[sel.selectedIndex].value;
	}
	function reset_select_value(item){
		var formdom = document.getElementById(formid);
		var sel = formdom[item.name];
		var value = item.value;
		for(var i=0; i<sel.options.length; i=i+1){
			if(sel.options[i].value == value){
				sel.options[i].selected = true;
				break;
			}
		}
	}
	function set_select_value(item, record){
		var formdom = document.getElementById(formid);
		var sel = formdom[item.name];
		var value = record[item.name];
		for(var i=0; i<sel.options.length; i=i+1){
			if(sel.options[i].value == value){
				sel.options[i].selected = true;
				break;
			}
		}
	}
	// 处理radio
	function get_radio_code(item) {
		var style = item.style ? "style=\""+item.style+"\"" : "";
		var value = item.value ? item.value : "";
		var code = "<div style='line-height:25px;'>";
		for (var i=0; i<item.options.length; ++i) {
			var checked = item.options[i].value==item.value ? "checked" : "";
			code += "<label class='pointer' "+style+"><input type='radio' name='"+item.name+"' "+
				    " value='"+item.options[i].value+"' "+checked+">"+item.options[i].text+"</label>";
		}
		code += "</div>";
		return code;
	}
	function get_radio_value(item) {
		var formdom = document.getElementById(formid); 
		var radios = formdom[item.name];
		for(var i=0; i<radios.length; i=i+1){
			if(radios[i].checked == true){
				return radios[i].value;
			}
		}
		if (item.errmsg) {
			document.getElementById(name+"-errmsg").innerHTML = item.errmsg;
		}
		throw new Error(item.name+" is not select");
	}
	function set_radio_value(item, record) {
		var formdom = document.getElementById(formid);
		var radios = formdom[item.name];
		for (var i=0; i<radios.length; ++i) {
			if (radios[i].value == record[item.name]) {
				radios[i].checked = true;
				return;
			}
		}
	}
	function reset_radio_value(item) {
		var record = {};
		record[item.name] = item.value;
		set_radio_value(item, record);
	}


	// 处理checkbox
	function get_checkbox_code(item) {
		var style = item.style ? "style=\""+item.style+"\"" : "";
		var value = item.value ? item.value : "";
		var code = "<div style='line-height:25px;'>";
		for (var i=0; i<item.options.length; ++i) {
			var checked = item.options[i].value==item.value ? "checked" : "";
			code += "<label class='pointer' "+style+"><input type='checkbox' name='"+item.name+"' "+
				    " value='"+item.options[i].value+"' "+checked+">"+item.options[i].text+"</label>";
		}
		code += "</div>";
		return code;
	}
	function get_checkbox_value(item) {
		var formdom = document.getElementById(formid); 
		var values = get_checkbox_values(item.name);
		if (values.length>0) {
			return values.join(",");
		}
		if (item.errmsg) {
			document.getElementById(item.name+"-errmsg").innerHTML = item.errmsg;
			throw new Error(item.name+" is not select");
		}
		return "";
	}
	
	function set_checkbox_value(item, record) {
		var formdom = document.getElementById(formid);
		var values = record[item.name].split(",");
		set_checkbox_values(item.name, values);
	}
	function reset_checkbox_value(item) {
		var record = {};
		record[item.name] = item.value;
		set_checkbox_value(item, record);
	}

	////////////////////////////////////////////////////////////
	
	// 创建form
	this.create = function()
	{
		var eleid = this.render;
		var code="<form id='form-div-fm' onsubmit='return false;'><table class='tabform'>";

		for (var i=0; i<items.length; ++i) {
			var label = items[i].label;
			var name = items[i].name;
			var type = items[i].type;
			if (type=="hidden") {
				code+=get_hidden_code(items[i]);
				continue;
			}
			code += "<tr><th width='"+this.labelWidth+"'>"+label+":</th><td>";
			switch (type) {
				case 'text': code+=get_text_code(items[i]); break;
				case 'textarea': code+=get_textarea_code(items[i]); break;
				case 'select': code+=get_select_code(items[i]); break;
				case 'radio': code+=get_radio_code(items[i]); break;
				case 'checkbox': code+=get_checkbox_code(items[i]); break;
			}
			code += "</td><td class='tip'><div id='"+name+"-errmsg'></div></td></tr>";
		}
		code += "</table></form>";
		document.getElementById(eleid).innerHTML = code;
	};

	// 提交
	this.submit = function()
	{
        var thiso=this;
		this.item = {};
		var formdom = document.getElementById(formid);
		for (var i=0; i<items.length; ++i) {
			var name = items[i].name;
			var type = items[i].type;
			var dom = document.getElementById(items[i].name+"-errmsg");
			if(dom) dom.innerHTML = "";  // reset errmsg
			switch (type) {
				case 'hidden':
				case 'text':
				case 'textarea': this.item[name] = get_text_value(items[i]); break;
				case 'select': this.item[name] = get_select_value(items[i]); break;
				case 'radio': this.item[name] = get_radio_value(items[i]); break;
				case 'checkbox': this.item[name] = get_checkbox_value(items[i]); break;
			}
		};
		thiso.fire("submit");
	};

	// 设置数据
	this.load = function(record)
	{
		var formdom = document.getElementById(formid);
		for (var i=0; i<items.length; ++i) {
			var dom = document.getElementById(items[i].name+"-errmsg");
			if(dom) dom.innerHTML = "";  // reset errmsg
			switch (items[i].type) {
				case "hidden":
				case "text":
				case "textarea": set_text_value(items[i], record); break;
				case "select": set_select_value(items[i], record); break;
				case "radio": set_radio_value(items[i], record); break;
				case "checkbox": set_checkbox_value(items[i], record); break;
			}
		}
		this.fire("load");
	};

	// 重置
	this.reset = function()
	{
		var formdom = document.getElementById(formid);
		for (var i=0; i<items.length; ++i) {
			var dom = document.getElementById(items[i].name+"-errmsg");
			if(dom) dom.innerHTML = "";  // reset errmsg
			switch (items[i].type) {
				case "hidden":
				case "text":
				case "textarea": reset_text_value(items[i]); break;
				case "select": reset_select_value(items[i]); break;
				case "radio": reset_radio_value(items[i]); break;
				case "checkbox": reset_checkbox_value(items[i]); break;
			}
		}
		this.fire("reset");
	};
};

MWT.extends(MWT.Form, MWT.Event);
