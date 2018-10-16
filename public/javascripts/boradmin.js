$(function(){
	//图书借阅管理审核功能
	$("table #auditout_btn").click(function(){
		var page = "";
		var url = location.search;
		if(url.indexOf("?") != -1) {
			page = url.substr(1);
		}
		$.ajax({
			type:"post",
			url:"/users/auditout1",
			data:{_id:$(this).attr("_id")},
			success:function(data){
				data = JSON.parse(data);
				if(data.code==1){
					alert("已审核");
					location.href = "/borfind?"+page;
				}
			}
		});
	})
	
	
	//图书借阅管理删除功能
	$("table #revertdelete_btn").click(function(){
		var page = "";
		var url = location.search;
		if(url.indexOf("?") != -1) {
			page = url.substr(1);
		}
		$.ajax({
			type:"post",
			url:"/users/revertdelete1",
			data:{_id:$(this).attr("_id"),bname:$(this).attr("bname")},
			success:function(data){
				data = JSON.parse(data);
				console.log(data);
				if(data.code==1){
					location.href = "/borfind?"+page;
				}
			}
		});
	})
})
