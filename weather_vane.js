//Module requirements
var webCall=require('http');
var hello;




//Weather Underground

var weatherURL;

//Weather Variables

var sunHour;
var sunMinute;
var highTemp;
var humidityPercent;
var rainInch;
var rainInchChance;
var tRainInch;
var tRainInchChance;
var yRainInch;

//call the weather API and setup the weather ball.

exports.buildWeather=function(state, location, api, history){
    weatherURL = 'http://api.wunderground.com/api/' + api + '/history_' + history + '/astronomy/forecast10day/q/' + state + '/' + location + '.json';
   // weatherURL = 'http://api.wunderground.com/api/84791c282f61fa15/astronomy/q/Australia/Sydney.json'
    webCall.get(weatherURL, function(res){
    
    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });
    
     res.on('end',function(){
        var obj = JSON.parse(data);
        
        //Populate my weather ball
       // console.log( obj.moon_phase.sunrise.hour + ":" + obj.moon_phase.sunrise.minute );
        sunHour = obj.moon_phase.sunrise.hour;
        sunMinute = obj.moon_phase.sunrise.minute;
        highTemp = obj.forecast.simpleforecast.forecastday[0].high.fahrenheit;
        humidityPercent = obj.forecast.simpleforecast.forecastday[0].avehumidity;
        rainInch = obj.forecast.simpleforecast.forecastday[0].qpf_allday.in;
        rainInchChance = obj.forecast.simpleforecast.forecastday[0].pop;
        tRainInch = obj.forecast.simpleforecast.forecastday[1].qpf_allday.in;
        tRainInchChance = obj.forecast.simpleforecast.forecastday[1].pop;
        yRainInch = obj.history.dailysummary[0].precipi;  
        
        
    });   
     
});

//Get weather stuff

exports.getSunHour=function(){
    return sunHour;  
};

exports.getSunMinute=function(){
    return sunMinute;
};

exports.getHighTemp=function(){
    return highTemp;
};

exports.getHumidityPercent=function(){
    return humidityPercent;
};

exports.getRainInch=function(){
    return rainInch;
};

exports.getRainInchChance=function(){
    return rainInchChance;
};

exports.getTRainInch=function() {
    return tRainInch;
};

exports.getTRainInchChance=function() {
    return tRainInchChance;
};

exports.getYRainInch=function(){
    return yRainInch;
};



//Test Functions please ignore!

exports.setHello=function(h) {
  hello = h;
};

exports.getHello = function(){
  return hello;  
};};