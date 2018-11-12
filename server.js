const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


var app = express();
var maintenancemode = false;

hbs.registerPartials(__dirname+'/views/partials');
 hbs.registerHelper('getYear',()=>{
  return new Date().getFullYear();
 })
app.set('views engine','hbs');

//middleware
app.use((req,res,next)=>{

  var now = new Date().toString();
  var logtext = `${now}: ${req.method} ${req.url}`;
  console.log(logtext)
  fs.appendFileSync('server.log',logtext+'\n',(err)={
    if(err){
      console.log('Unable to append file');
    }
  });
  next();
});

app.use((req,res,next)=>{
  if(maintenancemode){
    res.render('maintenance.hbs');
  }
  else{
    next();
  }
 
})

app.use(express.static(__dirname+'/public'));

//request routes
app.get('/',(req,res)=>{
  res.render('home.hbs',{
    HomeMessage:'Welcome Home',
    currentYear: new Date().getFullYear()
  });
})


app.get('/about',(req,res)=>{
 res.render('about.hbs',{
   pageTitle: 'About Page',
   currentYear: new Date().getFullYear()
 });
});

app.get('/bad',function(req,res){

res.send({
  errorMessage:'Bad Route',
});

});


app.listen(3000,function(){
  console.log('server started');
});

