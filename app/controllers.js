app.controller('HomeController', ['$scope', '$http', function($scope, $http) {

    $http.get('https://restcountries.eu/rest/v2/all')
    .then(function(response) {     
        console.log(response.data);
    });

    $scope.zoom = 2;

    // initialize the map
    $scope.map = L.map('map').setView([51.9194, 19.1451], $scope.zoom);
    console.log($scope.map);

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'Tiles by <a href="http://openstreetmap.org">OpenStreetMap</a>, Data by <a href="http://openweathermap.org">OpenWeather</a>',
        maxZoom: 19,
        minZoom: 1
    }).addTo($scope.map);

    // open weather API, it is possoble to change number of cities loaded by changing zoom paramter of bbox
    $http.get('https://api.openweathermap.org/data/2.5/box/city?bbox=-180,-180,180,180,'+$scope.zoom+'&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c')
    .then(function(response) {
        $scope.cities = response.data;
        console.log($scope.cities);
        var cityList = $scope.cities.list;
        for(let i=0; i<cityList.length; i++) {
            L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {
                iconUrl: '../style/lib/images/marker-icon.png'
            }).addTo($scope.map).bindPopup("<b>"+cityList[i].name+"</b></br>" +
                                           "Temperature: "+cityList[i].main.temp +'&#8451;</br>'+
                                           "Humidity: "+cityList[i].main.humidity +'%</br>'+
                                           "Pressure: "+cityList[i].main.pressure +'hPa');
        }
    });

}]);

app.controller('HeaderController', ['$scope', function($scope) {

    $scope.setActive = function(event) {
        $('.active').removeClass('active');
        if(!event) $('#home').addClass('active');
        else angular.element(event.srcElement).addClass("active");
    }

}]);