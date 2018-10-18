app.controller('HourlyController', ['$scope', '$http', function($scope, $http) {

    $scope.today = new Date();
    $scope.oneDayForward = new Date().setDate($scope.today.getDate() + 1);
    $scope.twoDayForward = new Date().setDate($scope.today.getDate() + 2);
    $scope.threeDayForward = new Date().setDate($scope.today.getDate() + 3);
    $scope.fourDayForward = new Date().setDate($scope.today.getDate() + 4);

    navigator.geolocation.getCurrentPosition(function(position) {
        $('#location-info').text('');
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        $scope.getWeatherInfo('http://api.openweathermap.org/data/2.5/forecast?lat=' + position.coords.latitude +
                              '&lon='+position.coords.longitude +
                              '&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c');
    });
    
    if(navigator.geolocation != {}) {
        $('#location-info').text("Turn on your browser's geolocation or enter your location!");
    }

    $scope.getForecastForLocation = function(location) {
        $('#location-info').text('');
        $scope.getWeatherInfo('http://api.openweathermap.org/data/2.5/forecast?q=' + location +
                              '&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c'); 
    }

    $scope.getWeatherInfo = function(URL) {
        $scope.forecastToday = [];
        $scope.forecastOneDayForward = [];
        $scope.forecastTwoDayForward = [];
        $scope.forecastThreeDayForward = [];
        $scope.forecastFourDayForward = [];

        $http.get(URL)
        .then(function(response) {
            $scope.forecastArray = response.data.list;
            for(let i=0; i<$scope.forecastArray.length; i++) {

                if($scope.forecastArray[i].weather[0].icon == '01d') $scope.forecastArray[i].icon = '../img/weather-icons/sun.png';
                else if($scope.forecastArray[i].weather[0].icon == '01n') $scope.forecastArray[i].icon = '../img/weather-icons/moon.png';
                else if($scope.forecastArray[i].weather[0].icon == '02d' || 
                        $scope.forecastArray[i].weather[0].icon == '02n') $scope.forecastArray[i].icon = '../img/weather-icons/cloudy-sun.png';
                else if($scope.forecastArray[i].weather[0].icon == '03d' || 
                        $scope.forecastArray[i].weather[0].icon == '03n' ||
                        $scope.forecastArray[i].weather[0].icon == '04d' ||
                        $scope.forecastArray[i].weather[0].icon == '04n') $scope.forecastArray[i].icon = '../img/weather-icons/clouds.png';
                else if($scope.forecastArray[i].weather[0].icon == '09d' || 
                        $scope.forecastArray[i].weather[0].icon == '09n') $scope.forecastArray[i].icon = '../img/weather-icons/big-rain.png';
                else if($scope.forecastArray[i].weather[0].icon == '10d' || 
                        $scope.forecastArray[i].weather[0].icon == '10n') $scope.forecastArray[i].icon = '../img/weather-icons/small-rain.png';
                else if($scope.forecastArray[i].weather[0].icon == '11d' || 
                        $scope.forecastArray[i].weather[0].icon == '11n') $scope.forecastArray[i].icon = '../img/weather-icons/lightning.png';
                else if($scope.forecastArray[i].weather[0].icon == '13d'|| 
                        $scope.forecastArray[i].weather[0].icon == '13n') $scope.forecastArray[i].icon = '../img/weather-icons/snow.png';
                else if($scope.forecastArray[i].weather[0].icon == '50d'|| 
                        $scope.forecastArray[i].weather[0].icon == '50n') $scope.forecastArray[i].icon = '../img/weather-icons/fog.png';

                var dt = new Date($scope.forecastArray[i].dt_txt);
                $scope.forecastArray[i].date = dt;
                if(dt.getDate() == $scope.today.getDate()) $scope.forecastToday.push($scope.forecastArray[i]);
                else if(dt.getDate() == new Date($scope.oneDayForward).getDate()) $scope.forecastOneDayForward.push($scope.forecastArray[i]);
                else if(dt.getDate() == new Date($scope.twoDayForward).getDate()) $scope.forecastTwoDayForward.push($scope.forecastArray[i]);
                else if(dt.getDate() == new Date($scope.threeDayForward).getDate()) $scope.forecastThreeDayForward.push($scope.forecastArray[i]);
                else if(dt.getDate() == new Date($scope.fourDayForward).getDate()) $scope.forecastFourDayForward.push($scope.forecastArray[i]);
            }

            $scope.currentlyDisplayedForecast = $scope.forecastToday;
            console.log($scope.currentlyDisplayedForecast);
            $("#hourlyWeatherTable").find('.active').removeClass('active');
            $('#today-nav').addClass("active");
        });
    }

    $scope.createTableForDate = function(date, event) {
        console.log($scope.currentlyDisplayedForecast);
        if(date == 'today') $scope.currentlyDisplayedForecast = $scope.forecastToday;
        else if(date == 'oneDay') $scope.currentlyDisplayedForecast = $scope.forecastOneDayForward;
        else if(date == 'twoDay') $scope.currentlyDisplayedForecast = $scope.forecastTwoDayForward;
        else if(date == 'threeDay') $scope.currentlyDisplayedForecast = $scope.forecastThreeDayForward;
        else if(date == 'fourDay') $scope.currentlyDisplayedForecast = $scope.forecastFourDayForward;

        $("#hourlyWeatherTable").find('.active').removeClass('active');
        angular.element(event.srcElement).addClass("active");
    }

    $scope.enterPressed = function(event) {
        if(event.keyCode == 13) $scope.getForecastForLocation(event.currentTarget.value);
    }

}]);