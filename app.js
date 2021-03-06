var http = require('http'),
    router = require('./router'),
    url = require('url');

http.createServer(function(req,res){
  if(req.url === '/favicon.ico') {
    res.writeHead(200,{'Content-Type':'image/x-icon'})
    res.end()
    return
  }
  var path = url.parse(req.url).pathname
  var currentRoute = router.match(path)
  if(currentRoute){
    currentRoute.fn(req,res,currentRoute);
  }
  else{
    res.end(404);
  }
}).listen(9000, function(err){
  if(err)console.log('restart server',err)
  console.log('Server is connected on Port 9000')
})
