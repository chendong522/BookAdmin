var express = require('express');
var router = express.Router();
//创建服务器连接
var mongodb = require("mongodb").MongoClient;
var db_str = "mongodb://localhost:27017/Pro";
var ObjectId = require("mongodb").ObjectId;
var querystring = require("querystring");
var async = require("async");

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

//注册数据操作
router.post("/register", (req, res) => {
	//连接数据库
	mongodb.connect(db_str, (err, database) => {
		//连接集合
		database.collection("user", (err, coll) => {
			coll.find({
				username: req.body["username"]
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(JSON.stringify({
						code: 0,
						msg: "注册失败"
					}));
					database.close();
				} else {
					coll.save(req.body, () => {
						res.send(JSON.stringify({
							code: 1,
							msg: "注册成功"
						}));
						database.close();
					});
				}
			})
		})
	})
})

//登陆数据处理
router.post("/login", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("user", (err, coll) => {
			coll.find({
				username: req.body["username"],
				password: req.body["password"]
			}).toArray((err, data) => {
				if(data.length > 0) {
					//用户数据存入session
					req.session.username = data[0].username;
					res.send(JSON.stringify({
						code: 1,
						msg: "登陆成功"
					}));
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "登陆失败"
					}));
				}
				database.close();
			})
		})
	})
})

//找回密码数据操作
router.post("/rePass", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("user", (err, coll) => {
			coll.find({
				username: req.body.username,
				tel: req.body.tel
			}).toArray((err, data) => {
				if(data.length > 0) {
					coll.update({
						username: req.body.username,
						tel: req.body.tel
					}, {
						$set: {
							password: req.body.password
						}
					}, () => {
						//密码重置成功直接跳转进入系统
						req.session.username = data[0].username;
						res.send(JSON.stringify({
							code: 1,
							msg: "密码重置成功"
						}));
					})
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "密码重置失败"
					}));
				}
				database.close();
			})
		})
	})
})

//新书上架
router.post("/newbook", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			coll.save(req.body, () => {
				res.send(JSON.stringify({
					code: 1,
					msg: "插入成功！"
				}));
				database.close();
			})
		})
	})
})

//编号查询图书
router.get("/findbook1", (req, res) => {
	var bid = req.query.newbid;
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			coll.find({
				newbid: bid
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(JSON.stringify({
						code: 1,
						msg: "查询成功"
					}));
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "未搜索到相应数据"
					}));
				}
				database.close();
			})
		})
	})
})

//书名模糊查找
router.get("/findbook2", (req, res) => {
	var bname = querystring.unescape(req.query.newbname); //获取请求路径上名称信息
	var reg = new RegExp("^" + bname); //构造函数创建包含变量的正则
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			coll.find({
				newbname: reg
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(JSON.stringify({
						code: 1,
						msg: "查询成功"
					}));
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "查询失败"
					}));
				}
				database.close();
			})
		})
	})
})

//图书类别查找
router.get("/findbook3", (req, res) => {
	var bkind = querystring.unescape(req.query.newbkind); //获取请求路径上类别信息
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			coll.find({
				newbkind: bkind
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(JSON.stringify({
						code: 1,
						msg: "查询成功"
					}));
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "查询失败"
					}));
				}
				database.close();
			})
		})
	})
})

//删除图书操作
router.post("/rmbook", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			var id = ObjectId(req.body.id);
			coll.remove({
				_id: id
			}, () => {
				res.send(JSON.stringify({
					code: 1,
					msg: "删除成功"
				}));
				database.close();
			})
		})
	})
})

//修改图书信息操作
router.post("/upbook", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			var id = ObjectId(req.body._id);
			coll.find({
				_id: id
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(JSON.stringify({
						code: 1,
						msg: "信息查询成功",
						data: data[0]
					}));
				} else {
					res.send(JSON.stringify({
						code: 0,
						msg: "无相应信息"
					}))
				}
				database.close();
			})
		})
	})
})

router.post("/upbook2", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("book", (err, coll) => {
			var id = ObjectId(req.body._id);
			coll.update({
				_id: id
			}, {
				$set: {
					newbid: req.body.newbid,
					newbkind: req.body.newbkind,
					newbname: req.body.newbname,
					newbwriter: req.body.newbwriter,
					newbdate: req.body.newbdate,
					newbpress: req.body.newbpress,
					newbinum: req.body.newbinum,
					newbaddnum: req.body.newbaddnum,
					newbother: req.body.newbother
				}
			}, () => {
				res.send(JSON.stringify({
					code: 1,
					msg: "修改成功"
				}));
				database.close();
			})
		})
	})
})

//学生信息添加
router.post("/stuinfo_add", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("stuinfo", (err, coll) => {
			coll.save(req.body, () => {
				res.send(JSON.stringify({
					code: 1,
					msg: "添加成功"
				}));
				database.close();
			})
		})
	})
})

//获取当前学生信息    加载学生信息页面时直接发送ajax请求获取当前登录的用户的信息，如果直接用页面渲染，后期用户资料信息更改麻烦
router.get("/stuinfo_up1", (req, res) => {
	mongodb.connect(db_str, (err, database) => {
		database.collection("stuinfo", (err, coll) => {
			coll.find({
				stuadname: req.session.username
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send({
						code: 1,
						msg: "信息获取成功",
						data: data[0]
					});
				} else {
					res.send({
						code: 0,
						msg: "无相应信息"
					});
				}
				database.close();
			})
		})
	})
})

//学生信息修改
router.post("/stuinfo_up2", (req, res) => {
	var stu_id = ObjectId(req.body.stu_id);
	mongodb.connect(db_str, (err, database) => {
		database.collection("stuinfo", (err, coll) => {
			coll.update({
				_id: stu_id
			}, {
				$set: {
					stunum: req.body.stunum,
					studept: req.body.studept,
					stuname: req.body.stuname,
					stusex: req.body.stusex,
					studate: req.body.studate,
					stutel: req.body.stutel,
					stuemail: req.body.stuemail,
					stuadname: req.body.stuadname,
					stuother: req.body.stuother
				}
			}, () => {
				res.send(JSON.stringify({
					code: 1,
					msg: "修改成功"
				}));
				database.close();
			})
		})
	})
})

//图书借阅操作
router.post("/bookbor", (req, res) => {
	//借阅书的_id值
	var b_id = ObjectId(req.body.b_id);
	console.log(b_id);
	//连接数据库   1.图书表中指定书数量-1   2.图书借阅表中插入新数据
	async.series([
		(callback)=>{
			mongodb.connect(db_str,(err,database)=>{
				database.collection("book",(err,coll)=>{
					//指定书数量-1
					coll.update({_id:b_id},{$inc:{newbaddnum:-1}},()=>{
						//获取书名
						coll.find({_id:b_id}).toArray((err,data)=>{
							callback(null,data[0].newbname);
						})	
					})									
				})
			})
		},(callback)=>{
			mongodb.connect(db_str,(err,database)=>{
				database.collection("stuinfo",(err,coll)=>{
					//获取登录用户姓名
					coll.find({stuadname:req.session.username}).toArray((err,data)=>{
						callback(null,data[0].stuname);
					})
				})
			})
		}
	],(err,data)=>{
		console.log(data);
		//data:[书名,用户名]
		mongodb.connect(db_str,(err,database)=>{
			database.collection("bookbor",(err,coll)=>{
				coll.save({stuname:data[1],book:data[0]},()=>{
					res.send(JSON.stringify({code:1}));
				});
			})
		})
		
	})
})

module.exports = router;