app.controller('HomeController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $scope.getForecast('http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude +
                              '&lon='+longitude +
                              '&appid=8d7dcb1a10c7f8249561e9a4a92d5e7c');
        $http.get('http://secure.geonames.org/findNearbyPlaceNameJSON?lat='+latitude+'&lng='+longitude+'&username=piter447')
        .then(function(response) {            
            $scope.createMapForCountry(response.data.geonames[0].countryName);
        }).catch(function(err) {
            $http.get('http://api.geonames.org/findNearbyPlaceNameJSON?lat='+latitude+'&lng='+longitude+'&username=piter447')
            .then(function(response) {            
                $scope.createMapForCountry(response.data.geonames[0].countryName);
            }).catch(function(err) {
                $scope.createMapForCountry('Poland');
            });
        });
    });

    if(!($window.innerWidth < 768)) {
        alert("Turn on your GPS and reload page to use the page optimally.");
    }

    $scope.createMapForCountry = function(countryName) {         
        $http.get('https://restcountries.eu/rest/v2/name/'+countryName)
        .then(function(response) {
            var countryObject = response.data[0];
            $scope.zoom = $scope.setZoom(countryObject.area);            
            $scope.initializeMap(countryObject.latlng[0], countryObject.latlng[1], $scope.zoom);
            var bounds = $scope.map.getBounds();
            $scope.getWeatherInfo($scope.map, bounds._southWest.lng, bounds._southWest.lat, 
                                  bounds._northEast.lng, bounds._northEast.lat, $scope.zoom);
        }).catch(function(err) {
            $scope.showToast();
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

            var cloudsIcon = L.icon({iconUrl: '../img/weather-icons/clouds.png', iconSize: [20, 20]});
            var cloudySunIcon = L.icon({iconUrl: '../img/weather-icons/cloudy-sun.png', iconSize: [25, 25]});
            var cloudyMoonIcon = L.icon({iconUrl: '../img/weather-icons/cloudy-moon.png', iconSize: [25, 25]});
            var lightningIcon = L.icon({iconUrl: '../img/weather-icons/lightning.png', iconSize: [20, 20]});
            var moonIcon = L.icon({iconUrl: '../img/weather-icons/moon.png', iconSize: [20, 20]});
            var bigRainIcon = L.icon({iconUrl: '../img/weather-icons/big-rain.png', iconSize: [20, 20]});
            var smallRainIcon = L.icon({iconUrl: '../img/weather-icons/small-rain.png', iconSize: [20, 20]});
            var snowIcon = L.icon({iconUrl: '../img/weather-icons/snow.png', iconSize: [20, 20]});
            var sunIcon = L.icon({iconUrl: '../img/weather-icons/sun.png', iconSize: [25, 25]});
            var fogIcon = L.icon({iconUrl: '../img/weather-icons/fog.png', iconSize: [25, 25]});

            for(let i=0; i<cityList.length; i++) {
                if(cityList[i].weather[0].icon == '01d') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: sunIcon});
                else if(cityList[i].weather[0].icon == '01n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: moonIcon});
                else if(cityList[i].weather[0].icon == '02d') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: cloudySunIcon});
                else if(cityList[i].weather[0].icon == '02n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: cloudyMoonIcon});
                else if(cityList[i].weather[0].icon == '03d' || 
                        cityList[i].weather[0].icon == '03n' ||
                        cityList[i].weather[0].icon == '04d' ||
                        cityList[i].weather[0].icon == '04n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: cloudsIcon});
                else if(cityList[i].weather[0].icon == '09d' || 
                        cityList[i].weather[0].icon == '09n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: bigRainIcon});
                else if(cityList[i].weather[0].icon == '10d' || 
                        cityList[i].weather[0].icon == '10n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: smallRainIcon});
                else if(cityList[i].weather[0].icon == '11d' || 
                        cityList[i].weather[0].icon == '11n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: lightningIcon});
                else if(cityList[i].weather[0].icon == '13d'|| 
                        cityList[i].weather[0].icon == '13n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: snowIcon});
                else if(cityList[i].weather[0].icon == '50d'|| 
                        cityList[i].weather[0].icon == '50n') var marker = L.marker([cityList[i].coord.Lat, cityList[i].coord.Lon], {icon: fogIcon});
                else console.log('Other Icon: ' + cityList[i].weather[0].icon);

                marker.addTo($scope.map).bindPopup('<b style="text-transform: uppercase">'+cityList[i].name+"</b></br>" +
                                                   '<i style="text-transform: capitalize">'+cityList[i].weather[0].description +'</i></br>'+
                                                   '<i class="fas fa-thermometer-empty"></i> Temperature: <i>'+cityList[i].main.temp +'&#8451;</i></br>'+
                                                   '<i class="fas fa-tint"></i> Humidity: <i>'+cityList[i].main.humidity +'%</i></br>'+
                                                   '<i class="fas fa-arrow-right"></i> Wind: <i>'+cityList[i].wind.speed +' m/s</i></br>'+
                                                   '<i class="fas fa-weight"></i> Pressure: <i>'+cityList[i].main.pressure +' hPa</i>');
            }
        });
    }

    $scope.getForecast = function(URL) {
        $scope.currentlyDisplayedForecast = [];

        $http.get(URL)
        .then(function(response) {
            $scope.location = response.data.city.name;
            $scope.forecastArray = response.data.list;

                if($scope.forecastArray[0].weather[0].icon == '01d') $scope.switchBackground('sun-bg');
                else if($scope.forecastArray[0].weather[0].icon == '01n') $scope.switchBackground('night-bg');
                else if($scope.forecastArray[0].weather[0].icon == '02d') $scope.switchBackground('cloudy-sun-bg');
                else if($scope.forecastArray[0].weather[0].icon == '02n') $scope.switchBackground('night-bg');
                else if($scope.forecastArray[0].weather[0].icon == '03d' || 
                        $scope.forecastArray[0].weather[0].icon == '03n' ||
                        $scope.forecastArray[0].weather[0].icon == '04d' ||
                        $scope.forecastArray[0].weather[0].icon == '04n') $scope.switchBackground('clouds-bg');
                else if($scope.forecastArray[0].weather[0].icon == '09d' || 
                        $scope.forecastArray[0].weather[0].icon == '09n') $scope.switchBackground('rain-bg');
                else if($scope.forecastArray[0].weather[0].icon == '10d' || 
                        $scope.forecastArray[0].weather[0].icon == '10n') $scope.switchBackground('rain-bg');
                else if($scope.forecastArray[0].weather[0].icon == '11d' || 
                        $scope.forecastArray[0].weather[0].icon == '11n') $scope.switchBackground('lightning-bg');
                else if($scope.forecastArray[0].weather[0].icon == '13d'|| 
                        $scope.forecastArray[0].weather[0].icon == '13n') $scope.switchBackground('snow-bg');
                else if($scope.forecastArray[0].weather[0].icon == '50d'|| 
                        $scope.forecastArray[0].weather[0].icon == '50n') $scope.switchBackground('fog-bg');

            for(let i=0; i<$scope.forecastArray.length; i++) {
                if($scope.forecastArray[i].weather[0].icon == '01d') $scope.forecastArray[i].icon = '../img/weather-icons/sun.png';
                else if($scope.forecastArray[i].weather[0].icon == '01n') $scope.forecastArray[i].icon = '../img/weather-icons/moon.png';
                else if($scope.forecastArray[i].weather[0].icon == '02d') $scope.forecastArray[i].icon = '../img/weather-icons/cloudy-sun.png';
                else if($scope.forecastArray[i].weather[0].icon == '02n') $scope.forecastArray[i].icon = '../img/weather-icons/cloudy-moon.png';
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
                $scope.currentlyDisplayedForecast.push($scope.forecastArray[i]);
                if($scope.currentlyDisplayedForecast.length == 5) break;
            }
        })
        .catch(function(error) {});
    }
    
    $scope.removeMarkers = function(map) {
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

    $scope.switchBackground = function(bgClass) {
        $('#wrapper').removeClass().addClass(bgClass);
    }

    $scope.showToast = function() {
        $("#snackbar").addClass("show");   
        setTimeout(function(){  
            $("#snackbar").removeClass("show"); 
        }, 2000);
    }

    $scope.enterPressed = function(event) {
        if(event.keyCode == 13) $scope.createMapForCountry(event.currentTarget.value);
    }


}]);