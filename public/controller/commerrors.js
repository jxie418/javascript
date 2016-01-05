/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AllCommErrorsController',['$scope','$http','CommErrorsService','$state','NavigateService', function($scope,$http,CommErrorsService,$state,NavigateService){
        var url = selectedENV.apiURL+"gateway/CommErrorLogs";
        $scope.errorMsg="";
        $scope.successMsg="";
        $scope.commErrorList =[];
        $scope.totalCommError = 0;
        $scope.commErrorPerPage = 25;
        $scope.currentPage = 1;
        $scope.totalPages =[];
        $scope.pageList =[];
        $scope.sortType     = 'createdDate'; // set the default sort type
        $scope.sortReverse  = true;
        $scope.searchClaimNumber ="";
        NavigateService.selectedTab = 1;

        $scope.pageChanged = function(newPage) {
            $scope.currentPage = newPage;
            $scope.errorMsg="";
            $scope.successMsg="";
            getResultsPage();
        };

        var getCommErrors = function() {
            spinner.spin(pageCenter);
            var skipNumber = ($scope.currentPage -1) * $scope.commErrorPerPage;
            var requestUrl = url + '?filter[order]=createdDate%20DESC';
            requestUrl +='&filter[skip]='+skipNumber;
            requestUrl +='&filter[limit]='+$scope.commErrorPerPage;
            $http.get(requestUrl).success(function(res){
                spinner.stop();
                $scope.commErrorList = res;
            }).error(function(){
                spinner.stop();
                $scope.errorMsg="Can't get comm error from server. Please try it later.";
            });
        };

        var getResultsPage= function(){
            if($scope.currentPage === 1) {
                $http.get(url+'/count').success(function(response){
                    $scope.totalCommError = response.count;
                    $scope.totalPages = $scope.totalCommError/$scope.commErrorPerPage;
                    $scope.totalPages = Math.ceil($scope.totalPages);
                    iniPages($scope);
                }).error(function(){
                    $scope.errorMsg="Can't get comm error count. Please try it later.";
                });
            } else {
                iniPages($scope);
            }
            getCommErrors();
        };

        getResultsPage();

        $scope.closeErrorMsg = function() {
            $scope.errorMsg ="";
        };
        $scope.closeSuccessMsg = function() {
            $scope.successMsg = "";
        };

        $scope.update = function(id) {
            $scope.errorMsg ="";
            $scope.successMsg="";
            console.log(id);
            spinner.spin(pageCenter);
            var requestUrl = url + '/'+id;
            $http.put(requestUrl,{isReported:true}).success(function(response){
                spinner.stop();
                console.log(response.id);
                getCommErrors();
                $scope.successMsg="Update isReported flag successfully.";
            }).error(function(){
                spinner.stop();
                $scope.errorMsg="Can't update isReported to true. Please try it later.";
            });
        }
    }]);