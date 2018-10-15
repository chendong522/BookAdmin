$(function() {
	//查询图书操作
	//编号查询
	$("#bidfind_btn").click(function() {
		$.ajax({
			type: "get",
			url: "/users/findbook1",
			data: {
				newbid: $("#bidfind").val()
			},
			success: function(data) {
				data = JSON.parse(data);
				//console.log(data);
				if(data.code == 1) {
					location.href = "/findbook1?bid=" + $("#bidfind").val();
				} else {
					alert("未找到相应信息");
				}
			}
		});
	})
	
	
	
	//书名模糊查询
	$("#bnamefind_btn").click(function(){
		$.ajax({
			type:"get",
			url:"/users/findbook2",
			data:{newbname:$("#bnamefind").val()},
			success:function(data){
				data = JSON.parse(data);
				if(data.code == 1) {
					location.href = "/findbook2?bname=" + $("#bnamefind").val();
				} else {
					alert("未找到相应信息");
				}
			}
		});
	})
	
	//类别查询
	$("#bkindfind_btn").click(function(){
		$.ajax({
			type:"get",
			url:"/users/findbook3",
			data:{newbkind:$("#bkindfind").val()},
			success:function(data){
				data = JSON.parse(data);
				if(data.code == 1) {
					location.href = "/findbook3?bkind=" + $("#bkindfind").val();
				} else {
					alert("未找到相应信息");
				}
			}
		});
	})
	
	
	

	//删除图书信息操作
	$("tbody #rmbtn").click(function() {
		var page = "";
		var url = location.search;
		if(url.indexOf("?") != -1) {
			page = url.substr(1);
		}
		//console.log(page);
		$.ajax({
			type: "post",
			url: "/users/rmbook",
			data: {
				id: $(this).data("id")
			},
			success: function(data) {
				data = JSON.parse(data);
				console.log(data);
				if(data.code == 1) {
					alert("删除成功");
					location.href = "/bookdetail?" + page;
				} else {
					alert("删除失败");
					location.href = "/bookdetail?" + page;
				}
			}
		});
	})

	//修改图书信息
	//先查询点击的修改信息的书目信息，将其传入弹出层
	$("tbody #upbtn").click(function() {
		$.ajax({
			type: "post",
			url: "/users/upbook",
			data: {
				_id: $(this).data("id")
			},
			success: function(data) {
				data = JSON.parse(data);
				//console.log(data);
				if(data.code == 1) {
					data = data.data;
					$(".modal #newbid").val(data.newbid);
					$(".modal #newbkind").val(data.newbkind);
					$(".modal #newbname").val(data.newbname);
					$(".modal #newbwriter").val(data.newbwriter);
					$(".modal .newbdate").val(data.newbdate);
					$(".modal #newbpress").val(data.newbpress);
					$(".modal #newbinum").val(data.newbinum);
					$(".modal #newbaddnum").val(data.newbaddnum);
					$(".modal .newbother").val(data.newbother);
					$(".modal #sureup").attr("_id", data._id);
				}
			}
		});
	})

	$(".modal #sureup").click(function() {
		var page = "";
		var url = location.search;
		if(url.indexOf("?") != -1) {
			page = url.substr(1);
		}
		$.ajax({
			type: "post",
			url: "/users/upbook2",
			data: {
				_id: $(this).attr("_id"),
				newbid: $("#newbid").val(),
				newbkind: $(".modal #newbkind").val(),
				newbname: $(".modal #newbname").val(),
				newbwriter: $(".modal #newbwriter").val(),
				newbdate: $(".modal .newbdate").val(),
				newbpress: $(".modal #newbpress").val(),
				newbinum: $(".modal #newbinum").val(),
				newbaddnum: $(".modal #newbaddnum").val(),
				newbother: $(".modal .newbother").val()
			},
			success: function(data) {
				data = JSON.parse(data);
				//console.log(data);
				if(data.code == 1) {
					alert("修改成功！");
					location.href = "/bookdetail?" + page;
				} else {
					alert("修改成功！");
					location.href = "/bookdetail?" + page;
				}
			}
		});
	})
})