app.controller('HeaderController', ['$scope', function($scope) {   
 
    if(document.URL.includes('/home')) {
        $scope.tabActive = 'home';
    } else if(document.URL.includes('/hourly')) {
        $scope.tabActive = 'hourly';
    } else if(document.URL.includes('/daily')) {
        $scope.tabActive = 'daily';
    } else if(document.URL.includes('/about')) {
        $scope.tabActive = 'about';
    }
    
    $scope.setActive = function(event) {
        $('.active').removeClass('active');
        if(!event) $('#home').addClass('active');
        else angular.element(event.srcElement).addClass("active");
    }
}]);

