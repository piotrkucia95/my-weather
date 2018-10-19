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

    var a = '{"cod":"200","message":0,"city":{"geoname_id":524901,"name":"Moscow","lat":55.7522,"lon":37.6156,"country":"RU","iso2":"RU","type":"city","population":0},"cnt":7,"list":[{"dt":1485766800,"temp":{"day":262.65,"min":261.41,"max":262.65,"night":261.41,"eve":262.65,"morn":262.65},"pressure":1024.53,"humidity":76,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":4.57,"deg":225,"clouds":0,"snow":0.01},{"dt":1485853200,"temp":{"day":262.31,"min":260.98,"max":265.44,"night":265.44,"eve":264.18,"morn":261.46},"pressure":1018.1,"humidity":91,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.1,"deg":249,"clouds":88,"snow":1.44},{"dt":1485939600,"temp":{"day":270.27,"min":266.9,"max":270.59,"night":268.06,"eve":269.66,"morn":266.9},"pressure":1010.85,"humidity":92,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.53,"deg":298,"clouds":64,"snow":0.92},{"dt":1486026000,"temp":{"day":263.46,"min":255.19,"max":264.02,"night":255.59,"eve":259.68,"morn":263.38},"pressure":1019.32,"humidity":84,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":3.06,"deg":344,"clouds":0},{"dt":1486112400,"temp":{"day":265.69,"min":256.55,"max":266,"night":256.55,"eve":260.09,"morn":266},"pressure":1012.2,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":7.35,"deg":24,"clouds":45,"snow":0.21},{"dt":1486198800,"temp":{"day":259.95,"min":254.73,"max":259.95,"night":257.13,"eve":254.73,"morn":257.02},"pressure":1029.5,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.6,"deg":331,"clouds":29},{"dt":1486285200,"temp":{"day":263.13,"min":259.11,"max":263.13,"night":262.01,"eve":261.32,"morn":259.11},"pressure":1023.21,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":5.33,"deg":234,"clouds":46,"snow":0.04}]}';
    console.log(JSON.parse(a));

}]);