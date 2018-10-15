app.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    
    navigator.geolocation.getCurrentPosition(function(position) {
        $('#location-info').text('');
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        $http.get('http://api.geonames.org/findNearbyPlaceNameJSON?lat='+position.coords.latitude+'&lng='+position.coords.longitude+'&username=piter447')
        .then(function(result) {
            $scope.createMapForCountry(result.data.geonames[0].countryName);
        });
    });
    
    if(navigator.geolocation != {}) {
        $('#location-info').text("Turn on your browser's geolocation or enter your location!");
    }

    $scope.createMapForCountry = function(countryName) {   
        $('#location-info').text('');
        
        $http.get('https://restcountries.eu/rest/v2/name/'+countryName)
        .then(function(response) {
            var countryObject = response.data[0];
            $scope.zoom = $scope.setZoom(countryObject.area);            
            $scope.initializeMap(countryObject.latlng[0], countryObject.latlng[1], $scope.zoom);
            var bounds = $scope.map.getBounds();
            $scope.getWeatherInfo($scope.map, bounds._southWest.lng, bounds._southWest.lat, 
                                  bounds._northEast.lng, bounds._northEast.lat, $scope.zoom);
        }).catch(function(err) {
            console.log(err);
        });    
    }
    
    $scope.getWeatherInfo = function(map, westBound, southBound, eastBound, northBound, zoom) {
        $http.get('https://api.openweathermap.org/data/2.5/box/city?bbox='+
                  westBound + ',' +
                  southBound + ',' +
                  eastBound + ',' +
                  northBound + ',' +
                  zoom +
                  '&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c')
        .then(function(response) {
             $scope.cities = response.data;
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
    }
    
    $scope.removeMarkers = function(map) {
        console.log(map);
        map.eachLayer(function(layer) {
            if(!layer._url) map.removeLayer(layer);
        });
    }
    
    $scope.setZoom = function(area) {
        if(area >= 12000000) return 2;
        else if(area >= 8000000 && area < 12000000) return 3;
        else if(area >= 2000000 && area < 7000000) return 4;
        else if(area >= 250000 && area < 2000000) return 5;
        else if(area >= 50000 && area < 250000) return 6;
        else if(area >= 10000 && area < 50000) return 7;
        else if(area >= 1000 && area < 10000) return 8;
        else if(area >= 500 && area < 1000) return 9;
        else if(area < 500) return 10;
    }
    
    $scope.initializeMap = function(lat, long, zoom) {
        if(!$scope.map) {
            $scope.map = L.map('map');
        
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: 'Tiles by <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>, Data by <a href="http://openweathermap.org" target="_blank">OpenWeather</a>',
                maxZoom: 19,
                minZoom: 1
            }).addTo($scope.map);
        }
        $scope.map.setView([lat, long], zoom);
        
        $scope.map.on('zoom', function() {
            $scope.removeMarkers($scope.map);
            var bounds = $scope.map.getBounds();
            $scope.getWeatherInfo($scope.map, bounds._southWest.lng, bounds._southWest.lat, 
                                  bounds._northEast.lng, bounds._northEast.lat, $scope.map._zoom);
        });
        
        $scope.map.on('dragend', function() {
            $scope.removeMarkers($scope.map);
            var bounds = $scope.map.getBounds();
            $scope.getWeatherInfo($scope.map, bounds._southWest.lng, bounds._southWest.lat, 
                                  bounds._northEast.lng, bounds._northEast.lat, $scope.map._zoom);
        });
    }


}]);

app.controller('HeaderController', ['$scope', function($scope) {

    $scope.setActive = function(event) {
        $('.active').removeClass('active');
        if(!event) $('#home').addClass('active');
        else angular.element(event.srcElement).addClass("active");
    }

}]);