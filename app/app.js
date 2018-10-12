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
            controller: ''
        })
        .when('/weekly', {
            templateUrl: 'views/weekly.html',
            controller: ''
        })
        .when('/monthly', {
            templateUrl: 'views/monthly.html',
            controller: ''
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: ''
        })
        .otherwise({
            redirectTo : '/home'
        });
}]);

app.run(function() {
    
});