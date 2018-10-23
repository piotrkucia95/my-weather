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

}]);