define(function(require){

	var o = {};

	o.dotry = function() {
		var tp = Math.round(new Date().getTime()/1000);
		var txtv = document.getElementById("source").value;
		while(txtv.indexOf("+") != -1){
			txtv = txtv.replace("+", "%2B");
		}   
		while(txtv.indexOf("&") != -1){
			txtv = txtv.replace("&", "%26");
		}   
		$.post("ui/save.php", {"txt": txtv}, function(data){
			//alert(data);
			if(data != "0"){
				document.getElementById("main_area").src = data;
			}else{
				alert("啊哦! 有人跟你在同一时间try了, 再试一下，(^_^)!");
			}   
		}); 
	};


	o.refresh = function() {
		var t = document.getElementById("main_area").src;
		document.getElementById("main_area").src = t;
	};

	o.opennew = function() {
		window.open(document.getElementById("main_area").src, "_blank");
	};

	return o;
});
