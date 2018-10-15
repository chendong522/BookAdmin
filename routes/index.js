var express = require('express');
var router = express.Router();
var fs = require("fs");
var mongodb = require("mongodb").MongoClient;
var db_str = "mongodb://localhost:27017/Pro";
var async = require("async");
var ObjectId = require("mongodb").ObjectId;
var querystring = require("querystring");

/* GET home page. */
//默认根目录加载登录界面
router.get('/', function(req, res, next) {
  	req.session.username = undefined;
  	res.render('index',{});
});

//注册页面渲染
router.get("/register",(req,res)=>{
	res.render("register",{});
});

//找回密码页面渲染
router.get("/rePass",(req,res)=>{
	res.render("rePass",{});
})

//系统界面渲染
router.get("/home",(req,res)=>{
	res.render("home",{username:req.session.username,infoUrl:"home_index"});
})

//图书列表页面渲染
router.get("/bookdetail",(req,res)=>{
	//默认加载数据库前面的图书信息
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;			
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page?page:1;
			
			//异步加载流程
			async.series([
				(callback)=>{
					coll.find({}).sort({_id:-1}).toArray((err,data)=>{
						count = data.length;//总条数
						allPages = Math.ceil(count/size);//总页数
						page = page<1?1:page>allPages?allPages:page;
					})
					callback(null,"");
				},
				(callback)=>{
					coll.find({}).sort({_id:-1}).limit(size).skip((page-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
				}
			],(err,data)=>{
				res.render("home",{username:req.session.username,infoUrl:"bookdetail",info:data[1],page:page,allPages:allPages});
				database.close();
			})
		})
	})
})

//新书上架页面
router.get("/newbook",(req,res)=>{
	res.render("home",{username:req.session.username,infoUrl:"newbook"});
})


//图书查询成功显示结果
router.get("/findbook1",(req,res)=>{
	//console.log(req.query.bid);
	var id = req.query.bid;  //获取查询图书的ID
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;			
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page?page:1;
			
			//异步加载流程
			async.series([
				(callback)=>{
					coll.find({newbid:id}).sort({_id:-1}).toArray((err,data)=>{
						count = data.length;//总条数
						allPages = Math.ceil(count/size);//总页数
						page = page<1?1:page>allPages?allPages:page;
					})
					callback(null,"");
				},
				(callback)=>{
					coll.find({newbid:id}).sort({_id:-1}).limit(size).skip((page-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
				}
			],(err,data)=>{
				res.render("home",{username:req.session.username,infoUrl:"findbook",info:data[1],page:page,allPages:allPages});
				database.close();
			})
		})
	})
})

router.get("/findbook2",(req,res)=>{
	var bname = querystring.unescape(req.query.bname);
	var reg = new RegExp("^"+bname);  //构造函数创建包含变量的正则
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;			
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page?page:1;
			
			//异步加载流程
			async.series([
				(callback)=>{
					coll.find({newbname:reg}).sort({_id:-1}).toArray((err,data)=>{
						count = data.length;//总条数
						allPages = Math.ceil(count/size);//总页数
						page = page<1?1:page>allPages?allPages:page;
					})
					callback(null,"");
				},
				(callback)=>{
					coll.find({newbname:reg}).sort({_id:-1}).limit(size).skip((page-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
				}
			],(err,data)=>{
				res.render("home",{username:req.session.username,infoUrl:"findbook",info:data[1],page:page,allPages:allPages});
				database.close();
			})
		})
	})
})

router.get("/findbook3",(req,res)=>{
	var bkind = querystring.unescape(req.query.bkind);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;			
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page?page:1;
			
			//异步加载流程
			async.series([
				(callback)=>{
					coll.find({newbkind:bkind}).sort({_id:-1}).toArray((err,data)=>{
						count = data.length;//总条数
						allPages = Math.ceil(count/size);//总页数
						page = page<1?1:page>allPages?allPages:page;
					})
					callback(null,"");
				},
				(callback)=>{
					coll.find({newbkind:bkind}).sort({_id:-1}).limit(size).skip((page-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
				}
			],(err,data)=>{
				res.render("home",{username:req.session.username,infoUrl:"findbook",info:data[1],page:page,allPages:allPages});
				database.close();
			})
		})
	})
})

module.exports = router;
