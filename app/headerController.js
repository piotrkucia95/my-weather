app.controller('HeaderController', ['$scope', function($scope) {

    $scope.setActive = function(event) {
        $('.active').removeClass('active');
        if(!event) $('#home').addClass('active');
        else angular.element(event.srcElement).addClass("active");
    }
}]);

