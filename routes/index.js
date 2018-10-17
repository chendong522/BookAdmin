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
	res.render('index', {});
});

//注册页面渲染
router.get("/register", (req, res) => {
	res.render("register", {});
});

//找回密码页面渲染
router.get("/rePass", (req, res) => {
	res.render("rePass", {});
})

//系统界面渲染
router.get("/home", (req, res) => {
	res.render("home", {
		username: req.session.username,
		infoUrl: "home_index"
	});
})

//图书列表页面渲染
router.get("/bookdetail", (req, res) => {
	//默认加载数据库前面的图书信息
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page ? page : 1;
			if(req.query.bid){
				//异步加载流程
				//书编号查询加载
				async.series([
					(callback) => {
						coll.find({newbid:req.query.bid}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({newbid:req.query.bid}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "bookdetail",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}else if(req.query.bname){
				var bname = req.query.bname;
				var reg = new RegExp("^"+bname);
				//异步加载流程
				//书名查询加载
				async.series([
					(callback) => {
						coll.find({newbname:reg}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({newbname:reg}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "bookdetail",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}else if(req.query.bkind){
				//异步加载流程
				//书类别加载
				async.series([
					(callback) => {
						coll.find({newbkind:req.query.bkind}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({newbkind:req.query.bkind}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "bookdetail",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}else{
				//异步加载流程
				//默认加载
				async.series([
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "bookdetail",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}
			
		})
	})
})

//新书上架页面
router.get("/newbook", (req, res) => {
	res.render("home", {
		username: req.session.username,
		infoUrl: "newbook"
	});
})

//学生个人信息添加页面渲染
router.get("/stuinfo_add",(req,res)=>{
	//先判断该学生信息是否已经存在
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			coll.find({stuadname:req.session.username}).toArray((err,data)=>{
				if(data.length>0){
					res.render("home",{username:req.session.username,infoUrl:"stuinfo_add",data:data[0]});
				}else{
					res.render("home",{username:req.session.username,infoUrl:"stuinfo_add",data:[]});
				}
				database.close();
			})
		})
	})
})

//学生个人信息查看修改页面渲染
router.get("/stuinfo_up",(req,res)=>{
	res.render("home",{username:req.session.username,infoUrl:"stuinfo_up"});
})


//学生图书借阅界面渲染
router.get("/stubor",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		//判断该用户借阅是否达到上限
		database.collection("bookbor",(err,coll)=>{
			coll.find({stuadname:req.session.username}).toArray((err,data)=>{
				if(data.length>=5){
					res.render("home", {
						username: req.session.username,
						infoUrl: "stubor",
						info:[],
						allPages:0,
						page:0
					});
					database.close();
				}else{
					database.collection("book",(err,coll)=>{
						//数据总条数
						var count = 0;
						//总页数
						var allPages = 0;
						//每页条数
						var size = 6;
						//页码
						var page = req.query.page;
						page = page ? page : 1;
						//未达到上限
						if(req.query.bname){
							var bname = req.query.bname;
							var reg = new RegExp("^"+bname);
							//异步加载流程
							//书名查找加载渲染
							async.series([
								(callback) => {
									coll.find({newbname:reg}).sort({
										_id: -1
									}).toArray((err, data) => {
										count = data.length; //总条数
										allPages = Math.ceil(count / size); //总页数
										page = page < 1 ? 1 : page > allPages ? allPages : page;
									})
									callback(null, "");
								},
								(callback) => {
									coll.find({newbname:reg}).sort({
										_id: -1
									}).limit(size).skip((page - 1) * size).toArray((err, data) => {
										callback(null, data);
									})
								}
							], (err, data) => {
								res.render("home", {
									username: req.session.username,
									infoUrl: "stubor",
									info: data[1],
									page: page,
									size:size,
									allPages: allPages
								});
								database.close();
							})
						}else if(req.query.bkind){
							//异步加载流程
							//书类查找加载渲染
							async.series([
								(callback) => {
									coll.find({newbkind:req.query.bkind}).sort({
										_id: -1
									}).toArray((err, data) => {
										count = data.length; //总条数
										allPages = Math.ceil(count / size); //总页数
										page = page < 1 ? 1 : page > allPages ? allPages : page;
									})
									callback(null, "");
								},
								(callback) => {
									coll.find({newbkind:req.query.bkind}).sort({
										_id: -1
									}).limit(size).skip((page - 1) * size).toArray((err, data) => {
										callback(null, data);
									})
								}
							], (err, data) => {
								res.render("home", {
									username: req.session.username,
									infoUrl: "stubor",
									info: data[1],
									page: page,
									size:size,
									allPages: allPages
								});
								database.close();
							})
						}else{
							//异步加载流程
							//书类查找加载渲染
							async.series([
								(callback) => {
									coll.find({}).sort({
										_id: -1
									}).toArray((err, data) => {
										count = data.length; //总条数
										allPages = Math.ceil(count / size); //总页数
										page = page < 1 ? 1 : page > allPages ? allPages : page;
									})
									callback(null, "");
								},
								(callback) => {
									coll.find({}).sort({
										_id: -1
									}).limit(size).skip((page - 1) * size).toArray((err, data) => {
										callback(null, data);
									})
								}
							], (err, data) => {
								res.render("home", {
									username: req.session.username,
									infoUrl: "stubor",
									info: data[1],
									page: page,
									size:size,
									allPages: allPages
								});
								database.close();
							})
						}
					})
				}
			})
		})
	})
})

//图书推荐页面渲染
router.get("/sturec",(req,res)=>{
	res.render("home",{username:req.session.username,infoUrl:"sturec"});
})


//图书借阅管理界面渲染
router.get("/borfind",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookbor",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page ? page : 1;
			
			//姓名查找查看借阅情况
			if(req.query.stuname){
				//异步加载流程
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({stuname:req.query.stuname}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({stuname:req.query.stuname}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "borfind",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}else{
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					res.render("home", {
						username: req.session.username,
						infoUrl: "borfind",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
					database.close();
				})
			}
			
		})
	})
})

//管理员进入图书推荐查看页面渲染
router.get("/recfind",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookrec",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page ? page : 1;

			//异步加载流程
			async.series([
				(callback) => {
					coll.find({}).sort({
						_id: -1
					}).toArray((err, data) => {
						count = data.length; //总条数
						allPages = Math.ceil(count / size); //总页数
						page = page < 1 ? 1 : page > allPages ? allPages : page;
					})
					callback(null, "");
				},
				(callback) => {
					coll.find({}).sort({
						_id: -1
					}).limit(size).skip((page - 1) * size).toArray((err, data) => {
						callback(null, data);
					})
				}
			], (err, data) => {
				if(data[1]==""){
					res.render("home", {
						username: req.session.username,
						infoUrl: "recfind",
						info:[],
						page: 0,
						size:size,
						allPages: 0
					});
				}else{
					res.render("home", {
						username: req.session.username,
						infoUrl: "recfind",
						info: data[1],
						page: page,
						size:size,
						allPages: allPages
					});
				}
				database.close();
			})
		})
	})
})


//管理员进入学生信息管理页面渲染
router.get("/ad_stuinfo",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			//数据总条数
			var count = 0;
			//总页数
			var allPages = 0;
			//每页条数
			var size = 5;
			//页码
			var page = req.query.page;
			page = page ? page : 1;
			
			if(req.query.stunum){
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({stunum:req.query.stunum}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({stunum:req.query.stunum}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					if(data[1]==""){
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info:[],
							page: 0,
							size:size,
							allPages: 0
						});
					}else{
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info: data[1],
							page: page,
							size:size,
							allPages: allPages
						});
					}
					database.close();
				})
			}else if(req.query.stuname){
				var stuname = req.query.stuname;
				var reg = new RegExp("^"+stuname);
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({stuname:reg}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({stuname:reg}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					if(data[1]==""){
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info:[],
							page: 0,
							size:size,
							allPages: 0
						});
					}else{
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info: data[1],
							page: page,
							size:size,
							allPages: allPages
						});
					}
					database.close();
				})
			}else if(req.query.studept){
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({studept:req.query.studept}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({studept:req.query.studept}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					if(data[1]==""){
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info:[],
							page: 0,
							size:size,
							allPages: 0
						});
					}else{
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info: data[1],
							page: page,
							size:size,
							allPages: allPages
						});
					}
					database.close();
				})
			}else{
				//异步加载流程
				async.series([
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).toArray((err, data) => {
							count = data.length; //总条数
							allPages = Math.ceil(count / size); //总页数
							page = page < 1 ? 1 : page > allPages ? allPages : page;
						})
						callback(null, "");
					},
					(callback) => {
						coll.find({}).sort({
							_id: -1
						}).limit(size).skip((page - 1) * size).toArray((err, data) => {
							callback(null, data);
						})
					}
				], (err, data) => {
					if(data[1]==""){
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info:[],
							page: 0,
							size:size,
							allPages: 0
						});
					}else{
						res.render("home", {
							username: req.session.username,
							infoUrl: "ad_stuinfo",
							info: data[1],
							page: page,
							size:size,
							allPages: allPages
						});
					}
					database.close();
				})
			}
		})
	})
})


//馆藏图书图表展示页面渲染
router.get("/bookcharts",(req,res)=>{
	res.render("home",{username:req.session.username,infoUrl:"bookcharts"});
})

module.exports = router;