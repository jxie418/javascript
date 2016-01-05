/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .factory('AuthService', ['$rootScope', function($rootScope) {
        var AuthService = {};
        AuthService.login = function(username) {
            $rootScope.currentUser ={
                username:username
            };
        };
        AuthService.logout = function() {
            $rootScope.currentUser = null;
        };
        return AuthService;
    }]);
