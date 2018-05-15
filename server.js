var url  = require("url"),
    fs=require("fs"),
    http=require("http"),
    querystring = require('querystring'),
    path = require("path");
http.createServer(function (req, res) {
    var pathname=__dirname+url.parse(req.url).pathname;
    if (path.extname(pathname)=="") {
        pathname+="/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }
    var body = "";
    req.on('data', function (chunk) {
           body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
       });
    req.on('end', function(){

      body = querystring.parse(body);  //将一个字符串反序列化为一个对象

      if(body.user && body.msg){
          console.log("body:",JSON.stringify(body));
          var str = Math.random().toString().slice(3);
          fs.writeFile(str + '.txt', JSON.stringify(body), (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
          });
      }
    })
    fs.exists(pathname,function(exists){
        if(exists){
            fs.readFile(pathname,function (err,data){
                console.log(data)
                res.end(data);
            });
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });
}).listen(8081);
console.log("Server running at localhost");