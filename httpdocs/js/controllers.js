'use strict';

/* Controllers */

var myApp =  angular.module('myApp.controllers',[]).
  controller('home', ['$scope',function($scope) {
  }])
  .controller('register', ['$scope','$location','Cookies','register',function($scope,$location,Cookies,register) {
        $scope.form_data = {};
        $scope.result = {"type":"error","message":""};
        $scope.submit = function() {
            var newuser = register;
            var result = newuser.post($scope.form_data,function(results) {
            if(results.Token) {
                $scope.result.token = results.Token;
                $scope.result.message = "User Created";
                Cookies.setItem("token",results.Token,2682000, "/","<SITE_NAME>")
                Cookies.setItem("user",results.Id,2682000, "/","<SITE_NAME>")
                $location.path("/home");
                $scope.$emit('navchange',{permissions:{'showRegister':false,'showLogin':false,'showLogout':true,'showProfile':true}});
              } else {
                $scope.result.status = 'failed';
                $scope.result.token = '';
                $scope.result.message = results.message;
              }
            });
        }
  }])
  .controller('login', ['$scope','Cookies','login','$route','$location',function($scope,Cookies,login,$route,$location) {
        $scope.form_data = {};
        $scope.result = [];
        $scope.submit = function() {
            var auth = login;
            var result = auth.post($scope.form_data,function(results) {
            var res = {};
            if(typeof(results['Token']) !== 'undefined') {
                res.status = 'success';
                res.token = results.Token;
                res.message = "Authentication Successful";
                res.type = "success";
                Cookies.setItem("token",results.Token,2682000, "/","<SITE_NAME>")
                Cookies.setItem("user",results.Id,2682000, "/","<SITE_NAME>")
                $location.path("/home");

                $scope.$emit('navchange',{permissions:{'showRegister':false,'showLogin':false,'showLogout':true,'showProfile':true}});
              } else {
                res.status = results.Status;
                res.token = '';
                res.message = results.Message;
                res.type = "error";
                $scope.result.push(res)
              }
            });

            $scope.closeAlert = function(index) {
                $scope.result.splice(index, 1);
             };
        }
  }])
    .controller('timerView',['$scope','$rootScope','$routeParams','getSolves','typeService','Cookies','solveService','scrambleService','profileService',function($scope,$rootScope,$routeParams,getSolves,typeService,Cookies,solveService,scrambleService,profileService) {    
        $scope.profile = {"CurrentSession":{"Id":0},"Inspection":true};
        profileService.get(function(response) {
            $scope.profile = response; 
            loadSolves();
        });
        $scope.cube = $routeParams.timer;
        $scope.stats;

        $rootScope.$on('timeList', function (event, data) {
           if(typeof data !== "undefined") {
            $scope.times.unshift(data);
           }
        });
        $scope.remove = function(index,solve) {
            solveService.delete(solve,function(response) {
                $scope.times.splice(index,1);
                $scope.stats = response.Stats
            });
        }
        $scope.adjust = function(type,solve,index) {
            if(solve[type] == "true") {
                solve[type] = "false";
            } else {
                solve[type] = "true";
            }
            solveService.adjust({"type":type,"user":solve.User,"solveId":solve.Id,"status":solve[type]},function(response) {
                $scope.times[index] = solve;
                processStats(response.Stats)
            });
        }  
        var scr = scrambleService.getScramble($routeParams.timer);
        $scope.scramble = scr.string;
        $scope.scrambleimage = scr.image;
        $scope.$emit('sent-scramble',{scramble:$scope.scramble});
        $scope.$on('scramble',function(scramble) {
            $scope.scramble = scramble.targetScope.scramble;
            $scope.scrambleimage = scramble.targetScope.scrambleimage;
        })
        $scope.$on('stats',function(stats) {
            processStats(stats.targetScope.stats);
        })

        function processStats(stats) {
            $scope.stats = stats;
        }
        function loadSolves() {
            if(Cookies.hasItem('token')) {
                var solves = getSolves.get(typeService.getType($routeParams.timer),$scope.profile.CurrentSession.Id,function(response) {
                    $scope.times = response;
                });
                solveService.stats(typeService.getType($routeParams.timer),$scope.profile.CurrentSession.Id,Cookies.getItem("user"),function(result) {
                    processStats(result)
                })
                $scope.loggedin = true;
                $scope.login = {"type":"warning","message":'',"show":false};
                $scope.permissions = {'showRegister':false,'showLogin':false,'showlogout':true,'showProfile':true};
            } else {
                $scope.times = [];
                $scope.login = {"type":"warning","message":"You are not currently logged in, you can still use the timer but your times will not be saved.","show":true};
                $scope.permissions = {'showRegister':true,'showLogin':true,'showlogout':false,'showProfile':false};
            }
        }
        $scope.setSettings = function(setting) {
            switch(setting) {
                case "Inspection":
                    if($scope.profile.Inspection) {
                        $scope.profile.Inspection = false;
                         $scope.$broadcast('inspectionoff');
                    } else {
                        $scope.profile.Inspection = true;
                        $scope.$broadcast('inspectionon');
                    }
                    $scope.$broadcast("inspection.update",{"profile":$scope.profile});
                    break;
                default:

            }
            profileService.put($scope.profile,function(response){
            });
        }   
        $scope.$on('profileUpdate', function (profile) {
               $scope.profile = profile.targetScope.profile;
               loadSolves()
        });
        $scope.close = function() {
            $scope.login.show = false;
        }
  }])
    .controller('timerController', ['$scope','$routeParams','$rootScope','$sce','solveService','typeService','Cookies','scrambleService','profileService',function($scope,$routeParams,$rootScope,$sce,solveService,typeService,Cookies,scrambleService,profileService) {
        var isTimer = function($routeParams) {
            var isTimer = false;
            if(typeof $routeParams.timer !== "undefined") {
                isTimer = true;
            }
            return isTimer;
        }

        //Transfer Test
        if(Cookies.hasItem('token')) {
            $scope.permissions = {'showRegister':false,'showLogin':false,'showLogout':true,'showProfile':true};
        } else {
            $scope.permissions = {'showRegister':true,'showLogin':true,'showLogout':false,'showProfile':false};
        }
        $scope.$on('scramble',function(scramble) {
            $scope.scramble = scramble.targetScope.scramble;
        });
        profileService.get(function(response) {
            $scope.session = response.CurrentSession.Id; 
        });
        $scope.timerRunning = false;
        $scope.currentTime = 0;
        $scope.cubeList = ['2x2x2','3x3x3','4x4x4','5x5x5','6x6x6','7x7x7','8x8x8','9x9x9','10x10x10','11x11x11'];
        $scope.$on('sent-scramble',function(scramble) {
            $scope.scramble = scramble.targetScope.scramble;
        });
        $scope.timerhold = false
        $scope.run = function(e) {
            if(e.keyCode == 32 && isTimer($routeParams) && !$scope.timerRunning && !$scope.timerhold) {
                console.log("Start");
                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
            } else if(e.keyCode == 32 && isTimer($routeParams) && $scope.timerRunning) {
                $scope.$broadcast('timer-stop');
                $scope.timerRunning = false;
                var user = '';
                if(Cookies.hasItem('user')) {
                    user = Cookies.getItem('user');
                }
                var solve = {"Id":"0","Session":$scope.session,"User":user,"Date": new Date(),"Scramble": $scope.scramble,"Time":$scope.miliseconds,"DisplayTime":$scope.currentTime,"Type":typeService.getType($routeParams.timer),"Dnf":false,"Penalty":false};
                $scope.stats;
                if(Cookies.hasItem('token')) {
                    solveService.put(solve,function(result) {
                        solve.Id = result.Id;
                        $scope.stats = result.Stats;
                        $scope.$broadcast('stats', {stats:result.Stats});
                    });
                }

                $scope.timeListUpdated(solve);
                console.log("Stop");
                var scr = scrambleService.getScramble($routeParams.timer);
                $scope.scramble = scr.string;
                $scope.scrambleimage = scr.image;
                $scope.$broadcast('scramble', {scramble:  $scope.scramble});
                
            }
            $scope.$on('timer-stopped', function (args) {
                $scope.miliseconds = args.targetScope.millis;
                $scope.currentTime = args.targetScope.time;

            });
             $scope.$on('timer-countdown', function (args) {
                if(args.targetScope.countdownRunning) {
                    $scope.timerRunning = false;
                } else {
                    $scope.timerRunning = true;
                }
            });
            $scope.$on('navchange', function (event,permissions) {
               $scope.permissions = permissions.permissions;
            });
        }
        $scope.$on('timerhold', function () {
            if($scope.timerhold) {
                $scope.timerhold = false;
            } else {
                $scope.timerhold = true;
            }
        });
        $scope.timeListUpdated = function (solve) {
            $rootScope.$broadcast('timeList', solve);
        };
        $scope.logout = function() {
            Cookies.removeItem("token","/","<SITE_NAME>");
            Cookies.removeItem("user","/","<SITE_NAME>");
            $scope.permissions = {'showRegister':true,'showLogin':true,'showLogout':false,'showProfile':false};
        }
        $scope.$on('navchange', function (event,permissions) {
            $scope.permissions = permissions.permissions;
        });
        $scope.$on('profileUpdate', function (profile) {
               $scope.session = profile.targetScope.profile.CurrentSession.Id;

        });
}]).controller('profile', ['$scope','$routeParams','profileService','getSolves',function($scope,$routeParams,profileService,getSolves) {
    $scope.solves = []
    profileService.get(function(response) {
        $scope.profile = response; 
    });
    getSolves.get(3,-1,function(response) {
        $scope.solves = response;
    });

}]).controller('sessionModel', ['$scope','$rootScope','$routeParams','$modal','$log','profileService',function($scope,$rootScope,$routeParams,$modal,$log,profileService) {
    profileService.get(function(response) {
        $scope.profile = response
        $scope.sessions = $scope.profile.Sessions
        $scope.selectedSession = $scope.profile.CurrentSession;
    });
    $scope.setSession = function (s) {
        $scope.selectedSession = s;
         $scope.profile.CurrentSession = s;
         profileService.put($scope.profile,function(response){
         });
         $scope.$emit("profileUpdate",{"profile":$scope.profile});
    };
    $scope.open = function () {
        $rootScope.$broadcast("timerhold");
        var modalInstance = $modal.open({
          templateUrl: 'session.html',
          controller: 'sessionInstance',
          resolve: {
            "profile":function() {
                return $scope.profile;
            }
          }
        });

        modalInstance.result.then(function (session) {
         if(session.newsession!="") {
            var newsession = {"id":$scope.profile.Sessions.length,"userid":$scope.profile.Id,"name":session.newsession};
            $scope.profile.CurrentSession = newsession;
            $scope.profile.Sessions.push(newsession);
            session.selected = newsession;
         }
         $scope.selectedSession = session.selected;
         $scope.profile.CurrentSession = session.selected;
         profileService.put($scope.profile,function(response){
            });
         $scope.$emit("profileupdate",{"profile":$scope.profile});
         $rootScope.$broadcast("timerhold");
        }, function () {
          $rootScope.$broadcast("timerhold");
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    profileService.get(function(response) {
        $scope.profile = response
    });

    //inspectionon
    $scope.$on('inspection.update', function (profile) {
        $scope.profile = profile.targetScope.profile;
    });
}]).controller('sessionInstance', ['$scope','$routeParams','$modalInstance','profile',function($scope,$routeParams,$modalInstance,profile) {
    $scope.sessions = profile.Sessions
    $scope.selectedSession = profile.CurrentSession;
    $scope.newsession = "";
    $scope.session = {
        "selected":$scope.selectedSession,
        "newsession":$scope.newsession
    }
      $scope.$watch('session.selected', function(){
        $scope.selectedSession = $scope.session.selected;

      });

      $scope.ok = function () {
        $modalInstance.close($scope.session);
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
}]);