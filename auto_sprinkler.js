//Import Modules
var sprink=require('/var/lib/cloud9//sprinkler/sprinkler_control');
var weather=require('/var/lib/cloud9//sprinkler/weather_vane');
var sql=require('sqlite3');


//Weather API Constants
var MY_STATE = 'NJ';
var MY_LOCATION = 'Collingswood';
var MY_KEY = '84791c282f61fa15';

//Watering Constants
var WATER_START = 0;
var WATER_MIN_TEMP = 50;
var TEMP_AVE = 60;
var HUMIDITY_START = 100;
var RAIN_REDUCTION = 30;
var YESTERDAY_REDUCTION = 30;
var TOMORROW_HIGH_REDUCTION = 30;
var TOMORROW_LOW_REDUCTION = 15;

//Sprinkler Constants
var FRONT_YARD = 'P9_14';
var BACK_YARD ='USR1';

//Time Variables
var date;
var holdTime;
var toDay;
var yesterDay;

//Sprinkler Variables
var waterTime;
var yesterdayWater;
var db = new sql.Database('/var/lib/cloud9/sprinkler/sprink.db');




//weather.setHello("Poop");
weather.buildWeather(MY_STATE, MY_LOCATION, MY_KEY, yesterDay);
//Wait to do something with the weathercall to ensure we've gotten it
    setTimeout(function(){
    date = new Date();
    toDay = date.yyyymmdd();
    yesterDay = date.tyyyymmdd();
    

//Figure out if watering is needed
waterTime = WATER_START;
//Adjust for temperature
waterTime = waterTime + (weather.getHighTemp());
console.log('Temp: ' + waterTime);
//Adjust for Humidity
waterTime = Math.round(waterTime * ((HUMIDITY_START - weather.getHumidityPercent())) * .01);
console.log('Humidity: ' + waterTime);
//Adjust for Rain
    if (weather.getRainInchChance() > 30) {
        waterTime = waterTime - Math.round(RAIN_REDUCTION * weather.getRainInch());
    }
    console.log('Rain: ' + waterTime);
//Adjust for rain yesterday
waterTime = waterTime - Math.round((YESTERDAY_REDUCTION * weather.getYRainInch()));
console.log('Yesterday Rain: ' + waterTime);

//Adjust for false report yesterday
db.each("SELECT * FROM sprinkler_times ORDER BY ID DESC LIMIT 1", function(err, row) {
      yesterdayWater = row.AMOUNT;
      
      if (yesterdayWater == 0 && weather.getYRainInch == 0) {
          waterTime = waterTime * 1.5;
      }
  });



//Adjust for rain tomorrow

    if (weather.getTRainInchChance() > 30 & weather.getTRainInchChance() < 50) {
        waterTime = waterTime - Math.round(TOMORROW_LOW_REDUCTION * weather.getTRainInch());
    }
    else if (weather.getTRainInchChance() > 49) {
        waterTime = waterTime - Math.round(TOMORROW_HIGH_REDUCTION * weather.getTRainInch());
    }
    
    if (weather.getHighTemp() < WATER_MIN_TEMP) {
     waterTime = 0;   
    }
    console.log('Tomorrow Rain: ' + waterTime);

console.log ('Water time: ' + waterTime);

//If watering is needed then hold until sunrise
    if (waterTime > 0) {
         waterTime = waterTime * 60000;
         holdTime = 2000;
         //holdTime = ((weather.getSunHour() * 60 * 60000) + (weather.getSunMinute() * 60000)) - date.getTime();
        setTimeout(function(){
        //Turn the Front Yard Sprinkler on and keep it on for determined length
        console.log('Watering for: ' + waterTime / 60000 + ' minutes');
        sprink.sprinklerOn(FRONT_YARD);
        setTimeout(function(){
            //Turn it back off
            sprink.sprinklerOff(FRONT_YARD);
            db.run('INSERT INTO sprinkler_times (DATE, AMOUNT) VALUES(' + toDay + ',' + waterTime + ')');
            console.log('Water off!');
        }, waterTime);
        }, holdTime);
    }

console.log('Sunrise: ' + weather.getSunHour() + ":" + weather.getSunMinute());

},2000);


//Today Time Format Function

//Time Function

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };
  
  
//Tomorrow Time Format Function

//Time Function

Date.prototype.tyyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = (this.getDate()-1).toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };

