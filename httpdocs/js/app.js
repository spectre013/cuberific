'use strict';
// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute','myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers','cookiesModule','ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/timer/:timer', {templateUrl: 'partials/timer.html', controller: 'timerController'});
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'home'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'login'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'register'});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'profile'});
    $routeProvider.otherwise({redirectTo: '/home'});

  }]);
