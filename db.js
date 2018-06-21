var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/lwj";
 
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  var dbo = db.db("lwj");
  var myobj = { email: "123", password: "123" };
    dbo.collection("user").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
    });
});