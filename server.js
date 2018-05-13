var url  = require("url"),
    fs=require("fs"),
    http=require("http"),
    querystring = require('querystring'),
    path = require("path");
http.createServer(function (req, res) {
    var pathname=__dirname+url.parse(req.url).pathname;
    console.log(pathname,123)
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
            switch(path.extname(pathname)){
                case ".html":
                    res.writeHead(200, {"Content-Type": "text/html"});
                    break;
                case ".js":
                    res.writeHead(200, {"Content-Type": "text/javascript"});
                    break;
                case ".css":
                    res.writeHead(200, {"Content-Type": "text/css"});
                    break;
                case ".gif":
                    res.writeHead(200, {"Content-Type": "image/gif"});
                    break;
                case ".jpg":
                    res.writeHead(200, {"Content-Type": "image/jpeg"});
                    break;
                case ".png":
                    res.writeHead(200, {"Content-Type": "image/png"});
                    break;
                default:
                    res.writeHead(200, {"Content-Type": "application/octet-stream"});
            }

            fs.readFile(pathname,function (err,data){
                res.end(data);
            });
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });
}).listen(8081);
console.log("Server running at localhost");