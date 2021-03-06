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
			coll.save({
					newbid: req.body.newbid,
					newbkind: req.body.newbkind,
					newbname: req.body.newbname,
					newbwriter: req.body.newbwriter,
					newbdate: req.body.newbdate,
					newbpress: req.body.newbpress,
					newbinum: req.body.newbinum,
					newbaddnum: Number(req.body.newbaddnum),
					newbother: req.body.newbother}, () => {
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
					newbaddnum: Number(req.body.newbaddnum),
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
	console.log(req.body);
	var stu_id = ObjectId(req.body.stu_id);
	console.log(stu_id);
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


//学生点击列表链接查看图书备注信息
router.get("/booklook",(req,res)=>{
	var _id = ObjectId(req.query._id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			coll.find({_id:_id}).toArray((err,data)=>{
				res.send(data[0]);
				database.close();
			})
		})
	})
})

//书名查找借阅
router.get("/bnameborfind",(req,res)=>{
	var bname = querystring.unescape(req.query.bname);
	var reg = new RegExp("^"+bname);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			coll.find({newbname:reg}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:0,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})

//书类别查找借阅
router.get("/bkindborfind",(req,res)=>{
	var bkind = req.query.bkind;
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			coll.find({newbkind:bkind}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:0,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})




//图书借阅操作
router.post("/bookbor", (req, res) => {
	//借阅书的_id值
	var b_id = ObjectId(req.body.b_id);
	//console.log(b_id);
	//连接数据库   1.图书表中指定书数量-1，获取书名       2.图书借阅表中插入新数据{系统名，用户姓名，[书编号，书名]}
	//并行无关联执行
	mongodb.connect(db_str,(err,database)=>{
	async.series([
		(callback)=>{
			database.collection("book",(err,coll)=>{
				//指定书数量-1
				coll.update({_id:b_id},{$inc:{newbaddnum:-1}},()=>{
				})
				//获取书名
				coll.find({_id:b_id}).toArray((err,data)=>{
					callback(null,[data[0].newbname,data[0].newbid]);
				})															
			})
		},(callback)=>{
				database.collection("stuinfo",(err,coll)=>{
					//获取登录用户姓名
					coll.find({stuadname:req.session.username}).toArray((err,data)=>{
						callback(null,data[0].stuname);
					})
				})
		}
	],(err,data)=>{
			//console.log(data);
			//data:[书名,用户名]
			database.collection("bookbor",(err,coll)=>{
				//stuadname用于借阅时判断是否借阅数量达到上限
				coll.save({stuadname:req.session.username,stuname:data[1],bookid:data[0][1],book:data[0][0],state:0},()=>{
					res.send(JSON.stringify({code:1,msg:"申请借阅成功"}));
				});
			})
			database.close();
		})
	})
})

//图书推荐
router.post("/sturec",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookrec",(err,coll)=>{
			coll.save(req.body,()=>{
				res.send(JSON.stringify({code:1,msg:"推荐成功"}));
				database.close();
			})
		})
	})
})



//管理员图书审核     改变bookbor集合中的state状态信息
router.post("/auditout1",(req,res)=>{
	var _id = ObjectId(req.body._id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookbor",(err,coll)=>{
			coll.update({_id:_id},{$set:{state:1}},()=>{
				res.send(JSON.stringify({code:1,msg:"已审核"}));
				database.close();
			})
		})
	})
})

//管理员图书借阅信息归还删除      删除借阅集合中的信息，图书集合中指定图书数量+1
router.post("/revertdelete1",(req,res)=>{
	var _id = ObjectId(req.body._id);
	var bookid = req.body.bookid;
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookbor",(err,coll)=>{
			coll.remove({_id:_id},()=>{
				database.close();
			})
		})
		database.collection("book",(err,coll)=>{
			coll.update({newbid:bookid},{$inc:{newbaddnum:1}},()=>{
				res.send(JSON.stringify({code:1,msg:"删除成功"}));
				database.close();
			})
		})
	})
})

//管理员通过指定学生姓名查看借阅情况
router.get("/borfind1",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookbor",(err,coll)=>{
			coll.find({stuname:req.query.stuname}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:0,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})


//管理员添加借书人员信息（当学生到图书馆直接借书时）       相应编号书籍数量-1    用户借阅集合插入新数据  状态直接为已审核
router.post("/boruseradd",(req,res)=>{
	console.log(req.body)
	mongodb.connect(db_str,(err,database)=>{
		async.series([
			(callback)=>{
				database.collection("book",(err,coll)=>{
					coll.update({newbid:req.body.bookid},{$inc:{newbaddnum:-1}},()=>{
						callback(null,"");
					})
				})
			},(callback)=>{
				database.collection("bookbor",(err,coll)=>{
					coll.save({stuadname:req.body.stuadname,stuname:req.body.stuname,bookid:req.body.bookid,book:req.body.book,state:1},()=>{
						callback(null,{code:1,msg:"借阅成功"});
					})
				})
			}
		],(err,data)=>{
			res.send(JSON.stringify(data[1]));
			database.close();
		})
	})
})

//管理员删除全部推荐图书信息
router.post("/deleteallrec",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("bookrec",(err,coll)=>{
			coll.deleteMany({},()=>{
				res.send(JSON.stringify({code:1,msg:"删除成功"}));
				database.close();
			})
		})
	})
})


//管理员通过学号查询指定学生信息
router.get("/stunumfind",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			coll.find({stunum:req.query.stunum}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:1,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})

//姓名模糊查询
router.get("/stunamefind",(req,res)=>{
	var stuname = req.query.stuname;
	var reg = new RegExp("^"+stuname);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			coll.find({stuname:reg}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:1,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})

//系别查询
router.get("/studeptfind",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			coll.find({studept:req.query.studept}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:1,msg:"查询失败"}));
				}
				database.close();
			})
		})
	})
})



//管理员修改学生信息，先获取信息
router.post("/stuinfoup",(req,res)=>{
	var _id = ObjectId(req.body.stu_id);
	mongodb.connect(db_str, (err, database) => {
		database.collection("stuinfo", (err, coll) => {
			coll.find({
				_id:_id
			}).toArray((err, data) => {
				if(data.length > 0) {
					res.send(data[0]);
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

//管理员删除学生信息
router.post("/stuinfodelete",(req,res)=>{
	var _id = ObjectId(req.body.stu_id);
	console.log(_id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection("stuinfo",(err,coll)=>{
			coll.remove({_id:_id},()=>{
				res.send(JSON.stringify({code:1,msg:"删除成功"}));
			})
		})
	})
})

module.exports = router;