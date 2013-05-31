var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs');
var path=require('path'), url=require('url');
var sprinkler=require('/var/lib/cloud9/sprinkler/sprinkler_control');
var bone = require('bonescript');

var FRONT_YARD = 'P9_14';
var BACK_YARD = 'USR0';



app.listen(8080);

 
function handler (req, res) {
  var my_path = url.parse(req.url).pathname;  
 // console.log(my_path);
    var full_path = path.join('/var/lib/cloud9/sprinkler/web_pages/',my_path);  
    console.log(full_path);
    path.exists(full_path,function(exists){  
        if(!exists){  
            res.writeHeader(404, {"Content-Type": "text/plain"});    
            res.write("404 Not Found\n");    
            res.end();  
        }  
        else{  
            fs.readFile(full_path, "binary", function(err, file) {    
                 if(err) {    
                     res.writeHeader(500, {"Content-Type": "text/plain"});    
                     res.write(err + "\n");    
                     res.end();    
                 
                 }    
                 else{  
                    res.writeHeader(200);    
                    res.write(file, "binary");    
                    res.end();  
                }  
                       
            });  
        }  
    });  
}

io.sockets.on('connection', function (socket) {
    bone.pinMode(FRONT_YARD, bone.OUTPUT);
    if(bone.digitalRead(FRONT_YARD) == 1) {
        socket.emit('front_on');
    }
    
   // bone.pinMode(BACK_YARD, bone.OUTPUT);
    //if(bone.digitalRead(BACK_YARD) == 1) {
      //  socket.emit('back_on');
   // }
    
    
 // socket.emit('news', { hello: 'world' });
  socket.on('water on', function (data) {
    console.log('Water on!');
    sprinkler.sprinklerOn(data);
  });
  socket.on('water off', function (data) {
     console.log('Water Off!');
     sprinkler.sprinklerOff(data);
  });
});