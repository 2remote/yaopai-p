var express = require('express');
var bodyParser = require('body-parser');
var urllib  = require('url');
var path = require('path');
var app = express();

//默认情况下Express并不知道该如何处理该请求体，因此我们需要增加bodyParser中间件，用于分析  
//application/x-www-form-urlencoded和application/json  
//请求体，并把变量存入req.body。我们可以像下面的样子来“使用”中间件[这个保证POST能取到请求参数的值]：     
app.use(bodyParser.urlencoded({ extended: false }));  

app.use(express.static(path.join(__dirname, '../dist')));

function responseJson(res,params,data){
  if (params.query && params.query.callback) {  
    //如果是jsonp请求，按照callback方式返回res
    //console.log(params.query.callback);  

    var str =  params.query.callback + '(' + JSON.stringify(data) + ')';//jsonp
    res.writeHeader(200,{"Access-Control-Allow-Origin":"*"}); 
    res.write(str);
    res.end();
    //res.send();  
  } else {  
    //非jsonp请求，正常返回，都加上"Access-Control-Allow-Origin":"*" 保证跨域访问
    res.writeHeader(200,{"Access-Control-Allow-Origin":"*"}); 
    res.write(JSON.stringify(data));
    res.end();
    //res.send();//普通的json  
    }    
}

/*
  主要测试login的返回值
*/
app.post('/login',function(req,res){
  var params = urllib.parse(req.url, true);
  var userName = req.body.userName ;
  var password = req.body.password ;

  console.log(req.body.userName + ':' + req.body.password + ' begin to login.');
  var result = {ErrorCode : 0 , user : {userName:'testUserName',userID : '1'}};
  //var result = {success : '0' , data : {errorMessage : '用户名或者密码错误'}}
  responseJson(res,params,result);
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});