app.controller('HourlyController', ['$scope', function($scope) {

    $scope.today = new Date();
    $scope.oneDayForward = new Date().setDate($scope.today.getDate() + 1);
    $scope.twoDayForward = new Date().setDate($scope.today.getDate() + 2);
    $scope.threeDayForward = new Date().setDate($scope.today.getDate() + 3);
    $scope.fourDayForward = new Date().setDate($scope.today.getDate() + 4);

    $scope.currentlyDisplayed = $scope.today;

    $scope.createTableForDate = function(date) {
        $scope.currentlyDisplayed = date;
    }

}]);