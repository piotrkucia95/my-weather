app.controller('DailyController', ['$scope', '$http', function($scope, $http) {

    $scope.today = new Date();

    navigator.geolocation.getCurrentPosition(function(position) {
        $('#location-info').text('');
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $scope.getWeatherInfo('http://api.apixu.com/v1/forecast.json?key=3df79fac1299461c83f83808182310&days=10&' +
                              'q=' + latitude + ',' + longitude);
    });

    if(navigator.geolocation != {}) {
        $('#location-info').text("Turn on your browser's geolocation or enter your location!");
    }

    $scope.getForecastForLocation = function(location) {
        $('#location-info').text('');
        $scope.getWeatherInfo('http://api.apixu.com/v1/forecast.json?key=3df79fac1299461c83f83808182310&days=7&' +
                              'q=' + location); 
    }

    $scope.getWeatherInfo = function(URL) {
        $http.get(URL)
        .then(function(response) {
            console.log(response.data);
            $scope.location = response.data.location.name;
            $scope.forecastArray = response.data.forecast.forecastday;

            var iconURL = '//cdn.apixu.com/weather/64x64/day/';
            for(let i=0; i<$scope.forecastArray.length; i++) {
                
                if($scope.forecastArray[i].day.condition.icon == iconURL+'113.png') 
                         $scope.forecastArray[i].icon = '../img/weather-icons/sun.png';
                else if($scope.forecastArray[i].day.condition.icon == iconURL+'116.png') 
                         $scope.forecastArray[i].icon = '../img/weather-icons/cloudy-sun.png';
                else if([iconURL+'119.png',iconURL+'122.png'].includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/clouds.png';
                else if([iconURL+'263.png',iconURL+'266.png',iconURL+'296.png',iconURL+'302.png',
                         iconURL+'308.png',iconURL+'359.png'].includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/big-rain.png';
                else if([iconURL+'176.png',iconURL+'185.png',iconURL+'356.png',iconURL+'281.png',iconURL+'284.png',
                         iconURL+'293.png',iconURL+'296.png',iconURL+'299.png',iconURL+'302.png',iconURL+'311.png',
                         iconURL+'314.png',iconURL+'353.png',iconURL+'305.png'].includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/small-rain.png';
                else if([iconURL+'200.png',iconURL+'386.png',iconURL+'389.png',iconURL+'392.png',iconURL+'395.png']
                         .includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/lightning.png';
                else if([iconURL+'179.png',iconURL+'182.png',iconURL+'227.png',iconURL+'230.png',iconURL+'317.png',iconURL+'320.png',
                         iconURL+'323.png',iconURL+'326.png',iconURL+'329.png',iconURL+'332.png',iconURL+'335.png',iconURL+'338.png',
                         iconURL+'350.png',iconURL+'362.png',iconURL+'365.png',iconURL+'368.png',iconURL+'371.png',iconURL+'374.png',
                         iconURL+'377.png'].includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/snow.png';
                else if([iconURL+'143.png',iconURL+'248.png',iconURL+'260.png'].includes($scope.forecastArray[i].day.condition.icon)) 
                         $scope.forecastArray[i].icon = '../img/weather-icons/fog.png';
                else $scope.forecastArray[i].icon = '../img/weather-icons/moon.png';

                var dt = new Date($scope.forecastArray[i].date);
                $scope.forecastArray[i].new_date = dt;
            }
            console.log($scope.forecastArray);
        })
        .catch(function(err) {
            $scope.showToast();
        });  
    }

    $scope.showToast = function() {
        $("#snackbar").addClass("show");   
        setTimeout(function(){  
            $("#snackbar").removeClass("show"); 
        }, 2000);
    }

    $scope.enterPressed = function(event) {
        if(event.keyCode == 13) $scope.getForecastForLocation(event.currentTarget.value);
    }

    var a = '{"cod":"200","message":0,"city":       {"geoname_id":524901,"name":"Moscow","lat":55.7522,"lon":37.6156,"country":"RU","iso2":"RU","type":"city","population":0},"cnt":7,"list":[{"dt":1485766800,"temp":{"day":262.65,"min":261.41,"max":262.65,"night":261.41,"eve":262.65,"morn":262.65},"pressure":1024.53,"humidity":76,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":4.57,"deg":225,"clouds":0,"snow":0.01},{"dt":1485853200,"temp":{"day":262.31,"min":260.98,"max":265.44,"night":265.44,"eve":264.18,"morn":261.46},"pressure":1018.1,"humidity":91,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.1,"deg":249,"clouds":88,"snow":1.44},{"dt":1485939600,"temp":{"day":270.27,"min":266.9,"max":270.59,"night":268.06,"eve":269.66,"morn":266.9},"pressure":1010.85,"humidity":92,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.53,"deg":298,"clouds":64,"snow":0.92},{"dt":1486026000,"temp":{"day":263.46,"min":255.19,"max":264.02,"night":255.59,"eve":259.68,"morn":263.38},"pressure":1019.32,"humidity":84,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":3.06,"deg":344,"clouds":0},{"dt":1486112400,"temp":{"day":265.69,"min":256.55,"max":266,"night":256.55,"eve":260.09,"morn":266},"pressure":1012.2,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":7.35,"deg":24,"clouds":45,"snow":0.21},{"dt":1486198800,"temp":{"day":259.95,"min":254.73,"max":259.95,"night":257.13,"eve":254.73,"morn":257.02},"pressure":1029.5,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.6,"deg":331,"clouds":29},{"dt":1486285200,"temp":{"day":263.13,"min":259.11,"max":263.13,"night":262.01,"eve":261.32,"morn":259.11},"pressure":1023.21,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":5.33,"deg":234,"clouds":46,"snow":0.04}]}';
    console.log(JSON.parse(a));
    
}]);