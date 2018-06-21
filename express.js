var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/lwj";
 MongoClient.Promise = global.Promise;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
});

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
 
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
 
app.post('/process_post', urlencodedParser, function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       email : req.body.email,
       password : req.body.password
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
    	res.sendFile( __dirname + "/" + "index.html" );
    }
    else{
    	res.sendFile( __dirname + "/" + "loginSuccess.html" );
    }
    });
    
    db.close();
});
    
})
 
var server = app.listen(8088, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})