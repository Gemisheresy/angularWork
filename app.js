var weatherApp = angular.module('weatherApp',['ngRoute','ngResource']);
var apiKey = 'a97e52cd7df2c8ff7dc565a104cb503e';
var weatherUrl ='//api.openweathermap.org/data/2.5/forecast?q=London,us&APPID=18671a0092fcf2b6b7ffa729dc1822b8'
weatherApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'pages/main.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:days',{
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })

});

weatherApp.service("cityService", function() {
    this.city = "New York, NY"
});



weatherApp.controller('homeController',['$scope','cityService',function($scope,cityService){
    $scope.city = cityService.city;

    $scope.$watch('city',function(){
        cityService.city = $scope.city;
    })

}]);
weatherApp.controller('forecastController',['$scope','$resource','$routeParams','cityService',function($scope,$resource,$routeParams,cityService){
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';
    $scope.weatherApi = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=18671a0092fcf2b6b7ffa729dc1822b8",
        {callback : 'JSON_CALLBACK'},{get : {method : "JSONP"}});

    $scope.weatherResult =  $scope.weatherApi.get({q: $scope.city , cnt: $scope.days });

    $scope.convertToFahr = function(degK){
        return Math.round(( 1.8 * (degK - 273 )) +32);
    };

    $scope.convertDate = function(dt){
        return new Date(dt * 1000);
    };

}]);

weatherApp.directive('resultsPanel', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/resultsPanel.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: "&",
            dateFormat: "@"

        }

    }

})