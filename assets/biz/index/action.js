define(function(require){

	var ErAction=require("er/Action");
	var s = new ErAction();

	s.on("enter",function(){
		var url = this.context.url;
        var f   = url.getQuery("f");
		if (!f) {
			f = "demos/button/button_01.html";
		}

		var tp = Math.round(new Date().getTime()/1000);
		$.get("ui/choose.php?tp="+tp+"&f="+f, function(data){
			if(data != "0"){
				document.getElementById("source").value = data;
				document.getElementById("main_area").src = f;
				close_demo_win();
			}else{
				alert("file does not exist.");
			}
		});
	});

	return s;
});
