var app = angular.module('myWeatherApp', ['ngRoute']);

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
        .when('/weekly', {
            templateUrl: 'views/weekly.html',
            controller: 'WeeklyController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .otherwise({
            redirectTo : '/home'
        });
}]);

app.run(function() {
    
});