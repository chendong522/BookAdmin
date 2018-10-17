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
			data:{_id:$(this).attr("_id"),bookid:$(this).attr("bookid")},
			success:function(data){
				data = JSON.parse(data);
				console.log(data);
				if(data.code==1){
					location.href = "/borfind?"+page;
				}
			}
		});
	})
	
	
	//查询指定学生的借阅信息
	$("#boruserfind_btn").click(function(){
		$.ajax({
			type:"get",
			url:"/users/borfind1",
			data:{stuname:$("#boruserfind").val()},
			success:function(data){
				data = JSON.parse(data);
				if(data.code==1){
					location.href = "/borfind?stuname="+$("#boruserfind").val();
				}else{
					alert("无相应数据");
				}
			}
		});
	})
	
	
	//管理员添加借书人员信息（当学生到图书馆直接借书时）
	$("#boruseradd_btn").click(function(){
		$.ajax({
			type:"post",
			url:"/users/boruseradd",
			data:{stuadname:$("#addstuadname").val(),stuname:$("#addstuname").val(),bookid:$("#addborbid").val(),book:$("#addborbname").val()},
			success:function(data){
				data = JSON.parse(data);
				console.log(data);
				if(data.code==1){
					alert("借阅成功！");
					location.href = "/borfind";
				}else{
					alert("出错了！");
				}
			}
		});
	})
})
