/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AuthLoginController', ['$scope', '$http', '$state','AuthService',
        function($scope, $http, $state,AuthService) {
            $scope.environments=MBE_ENV_DATA;
            $scope.errorMsg="";
            var getSelectEnv= function(index){
                var retVal = null;
                MBE_ENV_DATA.forEach(function(singleEnv){
                    if(singleEnv.value === index) {
                        retVal = singleEnv;
                    }
                });
                return retVal;
            };

            $scope.submit = function(){
                spinner.spin(pageCenter);
                selectedENV = getSelectEnv($scope.selectedEnv);
                console.log(JSON.stringify(selectedENV));
                var url = selectedENV.apiURL +'gateway/AuthUsers/login';
                console.log(url);
                $http.post(url,{username:$scope.username,password:$scope.password})
                    .then(
                    function(response) {
                        spinner.stop();
                        loginUser = $scope.username;
                        console.log(JSON.stringify(response));
                        AuthService.login($scope.username);
                        $state.go('all-claims');
                    },
                    function(error){
                        console.log(JSON.stringify(error));
                        spinner.stop();
                        $scope.errorMsg="Invalid username or password. Please try again.";
                    });
            };

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };
        }]);
