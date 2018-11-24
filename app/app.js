var app = angular.module('myWeatherApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/hourly', {
            templateUrl: 'views/hourly.html',
            controller: 'HourlyController'
        })
        .when('/daily', {
            templateUrl: 'views/daily.html',
            controller: 'DailyController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .otherwise({
            redirectTo : '/home'
        });
}]);

app.run(['$http', function($http) {

    switchBackground = function(bgClass) {
        $('#wrapper').removeClass().addClass(bgClass);
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $http.get('http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon='+longitude + '&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c')
        .then(function(response) {
            forecastArray = response.data.list;
    
                if(forecastArray[0].weather[0].icon == '01d') switchBackground('sun-bg');
                else if(forecastArray[0].weather[0].icon == '01n') switchBackground('night-bg');
                else if(forecastArray[0].weather[0].icon == '02d') switchBackground('cloudy-sun-bg');
                else if(forecastArray[0].weather[0].icon == '02n') switchBackground('night-bg');
                else if(forecastArray[0].weather[0].icon == '03d' || 
                        forecastArray[0].weather[0].icon == '03n' ||
                        forecastArray[0].weather[0].icon == '04d' ||
                        forecastArray[0].weather[0].icon == '04n') switchBackground('clouds-bg');
                else if(forecastArray[0].weather[0].icon == '09d' || 
                        forecastArray[0].weather[0].icon == '09n') switchBackground('rain-bg');
                else if(forecastArray[0].weather[0].icon == '10d' || 
                        forecastArray[0].weather[0].icon == '10n') switchBackground('rain-bg');
                else if(forecastArray[0].weather[0].icon == '11d' || 
                        forecastArray[0].weather[0].icon == '11n') switchBackground('lightning-bg');
                else if(forecastArray[0].weather[0].icon == '13d'|| 
                        forecastArray[0].weather[0].icon == '13n') switchBackground('snow-bg');
                else if(forecastArray[0].weather[0].icon == '50d'|| 
                        forecastArray[0].weather[0].icon == '50n') switchBackground('fog-bg');
    
        }).catch(function(error) {});    

    }, function(error) {
        switchBackground('night-bg');
    });
    
}]);