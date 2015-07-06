var routes = require('routes')(),
    fs = require('fs'),
    db = require('monk')('localhost/movies'),
    movies = db.get('movies'),
    qs = require('qs'),
    view = require('mustache'),
    //view = require('./view') ---> If you get time to refactor the project
    mime = require('mime');


//Route to the Home Page
routes.addRoute('/',(req,res,url) =>{
  res.setHeader('Content-Type','text/html')
  var file = fs.readFileSync('templates/movies/home.html')
  var template = file.toString()
  res.end(template)
})

//Route to the Index Page
routes.addRoute('/movies', function(req,res,url) {
  if(req.method === 'GET'){
    res.setHeader('Content-Type','text/html')
    movies.find({},function(err,docs){
      var file = fs.readFileSync('templates/movies/index.html')
      var template = view.render(file.toString(),{movies: docs})
      res.end(template)
    })
  }
})

//Route to public addresses
routes.addRoute('/public/*', (req,res,url) =>{
  res.setHeader('Content-Type',mime.lookup(req.url))
  fs.readFile('./' + req.url, function(err,file){
    if(err){
      res.end('404')
    }
    res.end(file)
  })
})

//Route to New Page
routes.addRoute('/movies/new',(req,res,url)=>{
  res.setHeader('Content-Type','text/html')
  var file = fs.readFileSync('templates/movies/new.html')
  var template = view.render(file.toString(),{})
  res.end(template);
})

//Route to Create Request
routes.addRoute('/movies/create',(req,res,url)=>{
  var data = ""
  req.on('data',function(chunk){
    data += chunk
  })
  req.on('end',function(){
    var film = qs.parse(data)
    movies.insert(film,function(err,doc){
      res.writeHead(302,{'Location':'/movies'})
      res.end()
    })
  })
})

//Route to Edit Page
routes.addRoute('/movies/:id/edit',(req,res,url)=>{
  if(req.method === 'GET'){
  //res.setHeader('Content-Type',mime.lookup(req.url))
  movies.findOne({_id: url.params.id}, function(err,film){
    var file = fs.readFileSync('templates/movies/edit.html')
    var template = view.render(file.toString(),film)
    res.end(template)
  })
 }
})

//Route to Delete Page
routes.addRoute('/movies/:id/delete',(req,res,url)=>{
  if(req.method === 'POST'){
    movies.remove({_id: url.params.id},function(err,film){
      if(err)return err
      res.writeHead(302,{'Location':'/movies'})
      res.end()
    })
  }
})

//Route to update Page
routes.addRoute('/movies/:id/update',(req,res,url)=>{
  var data = ''
  req.on('data',function(chunk){
    data += chunk
  })
  req.on('end',function(){
    var film = qs.parse(data)
    movies.update({_id: url.params.id}, film, function(err,doc){
      res.writeHead(302,{'Location':'/movies'})
      res.end()
    })
  })
})

//Route to Show Page aka :id
routes.addRoute('/movies/:id',(req,res,url)=>{
  if(req.method === 'GET'){
    movies.findOne({_id:url.params.id},function(err,film){
      var file = fs.readFileSync('templates/movies/show.html')
      var template = view.render(file.toString(),film)
      res.end(template)
    })
  }
})


module.exports = routes
