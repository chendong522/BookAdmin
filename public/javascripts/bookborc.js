//点击相应图书链接查看图书介绍信息
$("table tbody tr td a").click(function(){
	$.ajax({
		type:"get",
		url:"/users/booklook",
		data:{_id:$(this).attr("data-look")},
		success:function(data){
			//console.log(data);
			$("#myModalLabel").html(data.newbname);
			$(".modal-body").html(data.newbother);
		}
	});
})

//书名查找借阅
$("#bnameborfind_btn").click(function(){
	$.ajax({
		type:"get",
		url:"/users/bnameborfind",
		data:{bname:$("#bnameborfind").val()},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.code==1){
				location.href = "/stubor?bname="+$("#bnameborfind").val();
			}else{
				alert("未找到相应图书信息");
			}
		}
	});
})

//类别查找借阅
$("#bkindborfind_btn").click(function(){
	$.ajax({
		type:"get",
		url:"/users/bkindborfind",
		data:{bkind:$("#bkindborfind").val()},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.code==1){
				location.href = "/stubor?bkind="+$("#bkindborfind").val();
			}else{
				alert("未找到相应图书信息");
			}
		}
	});
})


//申请借阅图书操作
$("table tbody #bookbor").click(function(){
	var url = location.search;
	var page = "";
	if(url.indexOf("?"!=-1)){
		page = url.substr(url.indexOf("?")+1);
	}
	//console.log(page);
	$.ajax({
		type:"post",
		url:"/users/bookbor",
		data:{b_id:$(this).attr("data-id")},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.code==1){
				alert("申请成功，请尽快借阅");
				location.href = "/stubor?"+page;
			}
		}
	});
})