var bone=require('bonescript');
//Functions to turn the sprinklers on and off. Module created to
//Make life easier for me... I think...

exports.sprinklerOn = function(pin){
  bone.pinMode(pin, 'out');
  bone.digitalWrite(pin, bone.HIGH);
};

exports.sprinklerOff = function(pin){
  bone.pinMode(pin, 'out');
  bone.digitalWrite(pin, bone.LOW);
    
};