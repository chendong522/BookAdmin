var express = require('express');
var router = express.Router();
//创建服务器连接
var mongodb = require("mongodb").MongoClient;
var db_str = "mongodb://localhost:27017/Pro";
var ObjectId = require("mongodb").ObjectId;
var querystring = require("querystring");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册数据操作
router.post("/register",(req,res)=>{
	//连接数据库
	mongodb.connect(db_str,(err,database)=>{
		//连接集合
		database.collection("user",(err,coll)=>{
			coll.find({username:req.body["username"]}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:0,msg:"注册失败"}));
					database.close();
				}else{
					coll.save(req.body,()=>{
						res.send(JSON.stringify({code:1,msg:"注册成功"}));
						database.close();
					});
				}
			})
		})
	})
})

//登陆数据处理
router.post("/login",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("user",(err,coll)=>{
			coll.find({username:req.body["username"],password:req.body["password"]}).toArray((err,data)=>{
				if(data.length>0){
					//用户数据存入session
					req.session.username = data[0].username;
					res.send(JSON.stringify({code:1,msg:"登陆成功"}));
				}else{
					res.send(JSON.stringify({code:0,msg:"登陆失败"}));
				}
				database.close();
			})
		})
	})
})

//找回密码数据操作
router.post("/rePass",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("user",(err,coll)=>{
			coll.find({username:req.body.username,tel:req.body.tel}).toArray((err,data)=>{
				if(data.length>0){	
					coll.update({username:req.body.username,tel:req.body.tel},{$set:{password:req.body.password}},()=>{
						//密码重置成功直接跳转进入系统
						req.session.username = data[0].username;
						res.send(JSON.stringify({code:1,msg:"密码重置成功"}));
					})
				}else{
					res.send(JSON.stringify({code:0,msg:"密码重置失败"}));
				}
				database.close();
			})
		})
	})
})


//新书上架
router.post("/newbook",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			coll.save(req.body,()=>{
				res.send(JSON.stringify({code:1,msg:"插入成功！"}));
				database.close();
			})
		})
	})
})


//编号查询图书
router.get("/findbook1",(req,res)=>{
	var bid = req.query.newbid;
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			coll.find({newbid:bid}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"查询成功"}));
				}else{
					res.send(JSON.stringify({code:0,msg:"未搜索到相应数据"}));
				}
				database.close();
			})
		})
	})
})


//书名模糊查找
router.get("/findbook2",(req,res)=>{
	var bname = querystring.unescape(req.query.newbname);  //获取请求路径上名称信息
	var reg = new RegExp("^"+bname);  //构造函数创建包含变量的正则
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

//图书类别查找
router.get("/findbook3",(req,res)=>{
	var bkind = querystring.unescape(req.query.newbkind);  //获取请求路径上类别信息
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






//删除图书操作
router.post("/rmbook",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			var id = ObjectId(req.body.id);
			coll.remove({_id:id},()=>{
				res.send(JSON.stringify({code:1,msg:"删除成功"}));
				database.close();
			})
		})
	})
})

//修改图书信息操作
router.post("/upbook",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			var id = ObjectId(req.body._id);
			coll.find({_id:id}).toArray((err,data)=>{
				if(data.length>0){
					res.send(JSON.stringify({code:1,msg:"信息查询成功",data:data[0]}));
				}else{
					res.send(JSON.stringify({code:0,msg:"无相应信息"}))
				}
				database.close();
			})
		})
	})
})

router.post("/upbook2",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("book",(err,coll)=>{
			var id = ObjectId(req.body._id);
			coll.update({_id:id},{$set:{newbid:req.body.newbid,newbkind:req.body.newbkind,newbname:req.body.newbname,newbwriter:req.body.newbwriter,newbdate:req.body.newbdate,newbpress:req.body.newbpress,newbinum:req.body.newbinum,newbaddnum:req.body.newbaddnum,newbother:req.body.newbother}},()=>{
				res.send(JSON.stringify({code:1,msg:"修改成功"}));
				database.close();
			})
		})
	})
})

module.exports = router;
