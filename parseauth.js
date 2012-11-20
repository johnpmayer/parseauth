angular.module('parseauth', []).
    directive('parseauth', function() {
        return {
            restrict: 'E', // means this component must be used as an html element
            transclude: true, // means that the html enclosed by this tag will be replaced
            scope: {},
            controller: function($scope, $attrs, $element) {
                
                $scope.authdebug = JSON.parse($attrs.debug) ? function(msg){console.log(msg);} : function(){};
                
                var appid = $scope.appid = $attrs.appid;
                var jskey = $scope.jskey = $attrs.jskey;
                Parse.initialize(appid, jskey);
                
                $scope.authenticated = false;
                $scope.authmode = 'login';

                $scope.currentUser = Parse.User.current;

                $scope.applyMainUI = function() {
                    // OK to call this function from a callback outside of angular
                    $scope.$apply(function(){$scope.authenticated = true;});
                }

                $scope.loginUI = function() {
                    $scope.authmode = 'login';
                }

                $scope.registerUI = function(mode) {
                    $scope.authmode = 'register';
                }

                if ($scope.currentUser()) {
                    $scope.authenticated = true;
                } else {
                    $scope.authdebug("Need to log in");
                }

            },
            templateUrl: 'parseauth/templates/parseauth.html',
            replace: true
        };
    }).
    directive('loginbox', function() {
        return {
            require: '^parseauth',
            restrict: 'E',
            scope: true,
            controller: function($scope) {
                $scope.login = function() {
                    $scope.authdebug("Logging in...");
                    Parse.User.logIn($scope.username, $scope.password, {
                        success: function(user) {
                            $scope.authdebug("Authenticated!");
                            $scope.applyMainUI();
                        },
                        error: function(user, error) {
                            $scope.authdebug("Login failure: "+error);
                        }
                    });
                }
            },
            templateUrl: "parseauth/templates/loginbox.html",
            replace: true
        };
    }).
    directive('registerbox', function() {
        return {
            require: '^parseauth',
            restrict: 'E',
            scope: true,
            controller: function($scope) {
                $scope.register = function() {
                    $scope.authdebug("Registering...");
                    var reg_user = new Parse.User();
                    reg_user.set("email", $scope.email);
                    reg_user.set("username", $scope.username);
                    reg_user.set("password", $scope.password);
                    reg_user.signUp(null, {
                        success: function(user) {
                            $scope.authdebug("Authenticated!");
                            $scope.applyMainUI();
                        },
                        error: function(user,error) {
                            $scope.authdebug("Registration failure: "+error);
                        }
                    });
                }
            },
            templateUrl: 'parseauth/templates/registerbox.html',
            replace: true
        };
    })
