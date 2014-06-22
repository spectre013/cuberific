'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
   }]).directive('resize', ['$window',function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.$watch(function () {
            return { 'h': w.innerHeight()};
        }, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            
            scope.style = function () {
                return { 
                    'height': (newValue.h - 105) + 'px',
                };
            };
            
        }, true);
    
        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]).directive('timer', ['$compile', function ($compile) {
        return  {
            restrict: 'E',
            replace: false,
            scope: {
                interval: '=interval',
                startTimeAttr: '=startTime',
                countdownattr: '=countdown',
                inspectionattr: '=inspection',
                autoStart: '&autoStart'
            },
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                //angular 1.2 doesn't support attributes ending in "-start", so we're 
                //supporting both "autostart" and "auto-start" as a solution for
                //backward and forward compatibility.
                $scope.autoStart = $attrs.autoStart || $attrs.autostart;

                if ($element.html().trim().length === 0) {
                    $element.append($compile('<span>{{minutes}}:{{seconds}}.{{tenths}}</span>')($scope));
                }
                $scope.inter = $scope.interval
                $scope.inspection = $scope.inspectionattr.Inspection;
                $scope.startTime = null;
                $scope.timeoutId = null;
                $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) >= 0 ? parseInt($scope.countdownattr, 10) : undefined;
                $scope.isRunning = false;
                $scope.countdownRunning = false;

                $scope.$on('timer-start', function () {
                    $scope.start();
                });
                $scope.$on('timer-resume', function () {
                    $scope.resume();
                });

                $scope.$on('timer-stop', function () {
                    $scope.stop();
                });
                $scope.$on('inspectionoff', function () {
                    $scope.millis = 0;
                    $scope.inspection = false;
                    calculateTimeUnits();
                });
                $scope.$on('inspectionon', function () {
                    $scope.millis = $scope.countdownattr * 1000;
                    $scope.inspection = true;
                    $scope.inter = $attrs.interval
                    $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) >= 0 ? parseInt($scope.countdownattr, 10) : undefined;
                    calculateTimeUnits();
                });

                $scope.$watch('inspectionattr',function() {
                    $scope.inspection = $scope.inspectionattr.Inspection;
                    updateTimer() 
                });             

                function resetTimeout() {
                    if ($scope.timeoutId) {
                        clearTimeout($scope.timeoutId);
                    }
                }

                $scope.start = $element[0].start = function () {
                    if(!$scope.countdownRunning) {
                        $scope.startTime = $scope.startTimeAttr ? new Date($scope.startTimeAttr) : new Date();
                        if($scope.countdown != 0 && $scope.inspection) {
                            $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
                        }

                        resetTimeout();
                        tick();
                    } else {
                        startTimer();
                    }
                };

                $scope.resume = $element[0].resume = function () {
                    resetTimeout();
                    if ($scope.countdownattr) {
                        $scope.countdown += 1;
                    }
                    $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
                    tick();
                };

                $scope.stop = $scope.pause = $element[0].stop = $element[0].pause = function () {
                    $scope.stoppedTime = new Date();
                    resetTimeout();
                    $scope.$emit('timer-stopped', {millis: $scope.millis, seconds: $scope.seconds, minutes: $scope.minutes, hours: $scope.hours, days: $scope.days});
                    $scope.timeoutId = null;
                    if($scope.inspection) {
                        $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) >= 0 ? parseInt($scope.countdownattr, 10) : undefined;
                        $scope.inter = $scope.interval
                    }
                };

                $element.bind('$destroy', function () {
                    resetTimeout();
                });

                function startTimer() {
                    $scope.millis = 0;
                    $scope.countdown = 0;
                    $scope.countdownRunning = false;
                    $scope.inter = 0;
                    $scope.startTime = new Date();
                    $scope.$emit('timer-countdown',{"countdown":true});
                    calculateTimeUnits();
                    resetTimeout();
                    tick(); 
                }

                function calculateTimeUnits() {
                    $scope.tenths = Math.floor(($scope.millis / 10) % 100);
                    if($scope.tenths < 10 ) {
                        $scope.tenths = '0'+$scope.tenths;
                    }
                    $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
                    if($scope.seconds < 10 ) {
                        $scope.seconds = '0'+$scope.seconds;
                    }
                    $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
                    $scope.hours = Math.floor((($scope.millis / (3600000)) % 24));
                    $scope.days = Math.floor((($scope.millis / (3600000)) / 24));

                    if($scope.countdown > 0 && $scope.inspection) {
                        $scope.time = $scope.seconds;
                    } else {
                        if($scope.minutes > 0 ) {
                            $scope.time = $scope.minutes+":"+$scope.seconds+"."+$scope.tenths;
                        } else {
                            $scope.time = $scope.seconds+"."+$scope.tenths;
                        }
                    }
                    //console.log($scope.minutes,$scope.seconds,$scope.tenths,$scope.millis)
                }
                function updateTimer() {
                    if ($scope.countdownattr && $scope.inspection) {
                    $scope.millis = $scope.countdownattr * 1000;
                    } else {
                        $scope.millis = 0;
                    }
                    calculateTimeUnits();
                }
                //determine initial values of time units
                updateTimer();

                var tick = function () {
                    var adjustment = $scope.millis % 1000;
                    if ($scope.countdown > 0 && $scope.inspection) {
                        $scope.millis = $scope.countdown * 1000;
                        $scope.countdownRunning = true;
                        $scope.$emit('timer-countdown',{"countdown":false});
                    } else {
                        $scope.millis = new Date() - $scope.startTime;
                        $scope.inter = 0
                    }
                    calculateTimeUnits();
                    if ($scope.countdown > 0) {
                        $scope.countdown--;
                    } else if ($scope.countdown <= 0 && $scope.countdownRunning) {
                        startTimer() 
                        return;
                    }
                    //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
                    $scope.timeoutId = setTimeout(function () {
                        tick();
                        $scope.$digest();
                    }, $scope.inter - adjustment);

                    $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
                };

                if ($scope.autoStart === undefined || $scope.autoStart === true) {
                    $scope.start();
                }
            }]
        };
    }]);

