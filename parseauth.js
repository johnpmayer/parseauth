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
      template:
        '<div class="parseauth">' +
          '<loginbox ng-show="!authenticated && authmode == \'login\'"></loginbox>' +
          '<registerbox ng-show="!authenticated && authmode == \'register\'"></registerbox>' +
          '<div ng-show="authenticated" class="authed-content" ng-transclude></div>'+
        '</div>',
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
      template:
        '<div class="row-fluid">' +
          '<div class="offset4 span4 form-horizontal loginbox">' +
            '<div class="control-group">' +
              '<label class="control-label" for="inputUsername">Username</label>' +
              '<div class="controls">' +
                '<input type="text" ng-model="username" id="inputUsername" placeholder="Username"/>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<label class="control-label" for="inputPassword">Password</label>' +
              '<div class="controls">' +
                '<input type="password" ng-model="password" id="inputPassword" placeholder="Password"/>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<div class="controls">' +
                '<button class="btn" ng-click="login()">Login</button>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<div class="controls">' +
                '<a ng-click="registerUI()">Register</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>',
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
      template:
        '<div class="row-fluid">' +
          '<div class="offset4 span4 form-horizontal loginbox">' +
            '<div class="control-group">' +
              '<label class="control-label" for="inputEmail">Email</label>' +
              '<div class="controls">' +
                '<input type="text" ng-model="email" id="inputEmail" placeholder="Email"/>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<label class="control-label" for="inputUsername">Username</label>' +
              '<div class="controls">' +
                '<input type="text" ng-model="username" id="inputUsername" placeholder="Username"/>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<label class="control-label" for="inputPassword">Password</label>' +
              '<div class="controls">' +
                '<input type="password" ng-model="password" id="inputPassword" placeholder="Password"/>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<div class="controls">' +
                '<button class="btn" ng-click="register()">Register</button>' +
              '</div>' +
            '</div>' +
            '<div class="control-group">' +
              '<div class="controls">' +
                '<a ng-click="loginUI()">Login</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>',
      replace: true
    };
  })