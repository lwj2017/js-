var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
 MongoClient.Promise = global.Promise;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  
  db.close();
});

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static(path.join(__dirname, 'public')));
/**
 * 配置登录视图
 */
app.get('/', function(req, res) {
	res.sendfile(__dirname + "/" + "login.html");
})


app.post('/loginSuccess', urlencodedParser, function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "email" : req.body.email,
       "password" : req.body.password
   };
   console.log(response);
   
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("lwj");
    var Str = {"email":response.email,"password":response.password};
    var passwordStr = {"password":response.password};
    console.log(Str);// 查询条件
    var c = dbo.collection("user").find(Str).count();
    console.log(c);
    dbo.collection("user").find(Str).toArray(function(err, result) {
        if (err) throw err;
//      console.log(result.length);
        if(result.length==0) {
        	db.close();
    	res.sendFile( __dirname + "/" + "login.html" );
    }
    else{
    	db.close();
    	$("#person").text("欢迎您，"+response.email);
    	res.sendFile( __dirname + "/" + "loginSuccess.html" );
    }
    });
    
    
});
    
})
 
 app.get('/zhuce.html', function(req, res) {
	res.sendfile(__dirname + "/" + "zhuce.html");
})
 
 app.post('/zhuce', urlencodedParser, function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "email" : req.body.email,
       "password" : req.body.password
   };
   console.log(response);
   
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("lwj");
    var Str = {email:response.email,password:response.password};
    var emailStr = {email:response.email};
    console.log(emailStr);// 查询条件
    dbo.collection("user").find(emailStr).toArray(function(err, result) {
        if (err) throw err;
        c=result.length;
        if(c!=0) {
        console.log("222");
        res.send("<script>alert('账号已存在！');window.history.go(-1);</script>");
    	res.sendFile( __dirname + "/" + "zhuce.html" );
    }
    });
    	dbo.collection("user").deleteOne(emailStr, function(err, obj) {
        if (err) throw err;
        console.log("文档删除成功");
        db.close();
    });
    	dbo.collection("user").insertOne(Str, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        });
        $("#person").text("欢迎您，"+response.email);
    	res.sendFile( __dirname + "/" + "loginSuccess.html" );
    
    db.close();
    });
    
})
var server = app.listen(8088, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})