
// Click the button or press enter
document.querySelector('#submitCity').addEventListener('click', function(){
    // Display weather feature 
    getCityName();
    
});

document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13){
        getCityName();
    }    
});

// Delete the current weather info
function deleteCurrentElement(){
    const el = document.getElementById("weatherDetail");
    el.parentNode.removeChild(el);
};


// Automatically Get Location

getLocation();
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    var x = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    console.log(x);
//    getWeatherByLocation(position.coords.latitude,position.coords.longitude, addItem);
    var city = GeoReverse(position.coords.latitude,position.coords.longitude,getWeatherByCityName);
};


function GeoReverse(lat,lon,callback){
    var city;
    fetch(`https://eu1.locationiq.com/v1/reverse.php?key=84585deee2c6ee&lat=${lat}&lon=${lon}&format=json`).then(result => 
        {
            return result.json();
        })
        .then(
          data => 
            {city = data.address.city;
                callback(city, addItem);
            })
};



//
//function getWeatherByLocation(lat,lon,callback){
//    
//    
//    var apiRequest1 = fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=af081727ae6d5c4cbe2cd266b726e632`).then(result => {
//        return result.json()
//    });
//    var apiRequest2 = fetch(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a5bf94fc16c84928acb114156182311&q=${lat}/${lon}&num_of_days=1&tp=24&format=json`).then(result => {
//        return result.json()
//    });
//    
//
//    var combinedData = {'apiRequest1':{},'apiRequest2':{}};
//        Promise.all([apiRequest1,apiRequest2]).then(values => {
//            combinedData['apiRequest1'] = values[0];
//            combinedData['apiRequest2'] = values[1];
//            console.log(combinedData['apiRequest1']);
//            console.log(combinedData['apiRequest2']);
//            callback(combinedData);
//            return combinedData;
//    });
//};


// Get city name from city bar
function getCityName(){
    
    // Get rid of default space 
    document.getElementById('showWeather').style.height = 'auto';
    var city, test;
    city = document.querySelector('#city').value;
    console.log(city);
    if ((document.getElementById("weatherDetail")) !== null){
    deleteCurrentElement();}
    
    getWeatherByCityName(city, addItem);
};



function getWeatherByCityName(city, callback){
    // Combine data 
    var apiRequest1 = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=af081727ae6d5c4cbe2cd266b726e632`).then(result => {
        return result.json()
    });
    var apiRequest2 = fetch(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=a5bf94fc16c84928acb114156182311&q=${city}&num_of_days=1&tp=24&format=json`).then(result => {
        return result.json()
    });
    

    var combinedData = {'apiRequest1':{},'apiRequest2':{}};
        Promise.all([apiRequest1,apiRequest2]).then(values => {
            combinedData['apiRequest1'] = values[0];
            combinedData['apiRequest2'] = values[1];
            console.log(combinedData['apiRequest1']);
            console.log(combinedData['apiRequest2']);
            callback(combinedData);
            return combinedData;
    });
};
    
//    console.log(combinedData);
    
    // Call back from combineData to var 
    
    // Apply city name to API link 
//    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=af081727ae6d5c4cbe2cd266b726e632`)
//        .then(result => {
////            console.log(result);
//            return result.json();
//        })
//        .then(data => { // Call back from here
function addItem(data){
// car back function combinedData => data 
    var html, newHtml, element;
        html = '<div class="row" id="weatherDetail"><h4 class="text-center text-primary"><strong>%city%</strong></h4><h5 class="text-center">%time%</h5><h1 class="text-center"><img src=%icon% class="weatherIcon"> %temp%&#176</h1><h4 class="text-center text-primary weatherGeneral">%weather%</h4><p></p><p></p><div class="row"><div class="col span-1-of-4 weatherInDetail"><img src="images/wind.svg" class="detailIcon" style="center"><h4 class="text-center">Wind</h4><div class="text-center">%wind%</div></div><div class="col span-1-of-4 weatherInDetail"><img src="images/precipitation.svg" class="detailIcon" style="center"><h4 class="text-center">Precipitation</h4><div class="text-center">%precipitation%%</div></div><div class="col span-1-of-4 weatherInDetail"><img src="images/humidity.svg" class="detailIcon" style="center"><h4 class="text-center">Humidity</h4><div class="text-center">%humidity%%</div></div><div class="col span-1-of-4 weatherInDetail"><img src="images/pressure.svg" class="detailIcon" style="center"><h4 class="text-center">Pressure</h4><div class="text-center">%pressure%</div></div></div><div class="row"><div class="text-center tips" style="font-style: italic;">%tips%</div></div></div>';

//   Data of city, date, temp and weather in general 
//            Get replace html with data 
    newHtml = html.replace('%city%', data['apiRequest1'].name);
    newHtml = newHtml.replace('%time%', getDate());
    newHtml = newHtml.replace('%weather%', data['apiRequest1'].weather[0].description);
    newHtml = newHtml.replace('%icon%', 'Resources/weatherIcon/' + data['apiRequest1'].weather[0].main + '.svg');
    newHtml = newHtml.replace('%temp%', Math.round(data['apiRequest1'].main.temp));
//   Data of wind, precipitation, Humidity and pressure 

    newHtml = newHtml.replace('%wind%', data['apiRequest1'].wind.speed);
    newHtml = newHtml.replace('%precipitation%', data['apiRequest2'].data.weather[0].hourly[0].chanceofrain);
    newHtml = newHtml.replace('%humidity%', data['apiRequest1'].main.humidity);
    newHtml = newHtml.replace('%pressure%', data['apiRequest1'].main.pressure);
    newHtml = newHtml.replace('%tips%', () => 
                              {
                                var result = '';
                                    if (data['apiRequest1'].weather[0].main == 'Foggy') {
                                        result += `Not having <strong>a reflector</strong> today is like having sex without light. It feels good, but your partner misses all the good stuff <br>`;
                                    };
                                    if (data['apiRequest1'].weather[0].main == 'Rain') { result += `Bring your umbrella today, you're gonna need it!<br>`;};
                                    if (data['apiRequest1'].main.temp < 0) {result += `Bring your warm clothes today, but if you're a Finn, just go with T-shirt :) <br>`;}; 
                                return result;
                              });


//      Display HTML line 
    document.querySelector('#showWeather').insertAdjacentHTML('beforeEnd', newHtml);
};


//////// 
// Other functions 

function getDate(){
    var currentTime = new Date(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        day = currentTime.getDay(),
        date = currentTime.getDate(),
        monthInt = currentTime.getMonth();
    var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
    var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

    if (minutes<10){minutes = "0" + minutes;}    
    return `${weekday[day]} ${date} ${month[monthInt]} ${hours}:${minutes}`;
};


//////////
// Ask for permission of Notification



/* Project step 
1. Display the attribute in the design way (Showing the flatform )
 - Display the weather icon + temperature 
  + Write an HMTL line for displaying the temperature 
  + Customize it with CSS 
  
 - Display each attributes 
  + wind
  + precipitation
  + humidity
  + pressure 
 - Display 
2. Customize display for mobile user 

3. Ask to track location of user 

4. Notification at 7Am in the morning


*/