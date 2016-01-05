/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .factory('ClaimService', ['$http', '$q', '$rootScope', function($http, $q,
                                                                   $rootScope) {
        var ClaimService = {};
        ClaimService.conditionNumber = 0;
        ClaimService.selectedClaim = {};
        ClaimService.url ='';
        ClaimService.selectOneClaim = function(claim) {
            ClaimService.selectedClaim = claim;
            ClaimService.url = selectedENV.apiURL+"/Claims/"+claim.id+"?access_token="+selectedENV.accessToken;
        };

        ClaimService.resendpasscode = function(callbackSuccess, callbackError) {
            var url = selectedENV.apiURL +"/Claims/resendInviteToVehicleOwner?id="+ ClaimService.selectedClaim.id +"&access_token="+selectedENV.accessToken;
            var claimNumber = ClaimService.selectedClaim.claimNumber;
            $http.get(url).success(function(response){
                callbackSuccess(response);
            }).error(function(error){
               callbackError(error);
            });
        };

        ClaimService.update = function(claim,callbackSuccess, callbackError) {
            ClaimService.selectOneClaim(claim);
            $http.put(ClaimService.url.url,claim)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };

        ClaimService.getQueryUrl = function(claimNumber,beginDate,endDate,url) {
            ClaimService.conditionNumber = 0;
            if (typeof (claimNumber) !== 'undefined' && claimNumber !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][claimNumber][like]="+""+claimNumber.toString()+"";
                ClaimService.conditionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][gt]="+beginDate;
                ClaimService.conditionNumber++;
                url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][lt]="+endDate;
                ClaimService.conditionNumber++;
            }
            url +="&where[and]["+ClaimService.conditionNumber+"][orgId]="+selectedENV.orgID;
            ClaimService.conditionNumber++;
            return url;
        };

        ClaimService.getClaimSubmittedCount = function(claimNumber,beginDate,endDate,callbackSuccess, callbackError){
            var url = selectedENV.apiURL+"/Claims/count?access_token="+selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,beginDate,endDate,url);
            url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus][gt]=4";
            $http.get(url)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };

        ClaimService.getClaimCount = function(claimNumber,beginDate,endDate,callbackSuccess, callbackError){
            var url = selectedENV.apiURL+"/Claims/count?access_token="+selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,beginDate,endDate,url);
            $http.get(url)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };

        ClaimService.getClaimList = function(claimNumber,beginDate,endDate,currentPage,claimPerPage,callbackSuccess, callbackError) {
            var url = selectedENV.apiURL +"/Claims?filter[order]=createdDate%20DESC";
            url = ClaimService.getQueryUrl(claimNumber,beginDate,endDate,url);
            var skipNumber = parseInt((currentPage -1) * claimPerPage);
            url +='&filter[skip]='+skipNumber;
            url +='&filter[limit]='+claimPerPage;
            url +="&access_token="+selectedENV.accessToken;
            $http.get(url)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };

        ClaimService.load = function(success,fail) {
          $http.get(ClaimService.url).success(function(res){
              success(res);
          }).error(function(error){
              fail(error);
          });
        };

        return ClaimService;
    }])
    .factory('SurveyDataService',['$http',function($http){
        var SurveyDataService = {};
        SurveyDataService.conditionNumber = 0;
        SurveyDataService.getQueryUrl = function(beginDate,endDate,url) {
            SurveyDataService.conditionNumber = 0;
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&where[and]["+SurveyDataService.conditionNumber+"][createdDate][gt]="+beginDate;
                SurveyDataService.conditionNumber++;
                url += "&where[and]["+SurveyDataService.conditionNumber+"][createdDate][lt]="+endDate;
                SurveyDataService.conditionNumber++;
            }
            url +="&where[and]["+SurveyDataService.conditionNumber+"][orgId]="+selectedENV.orgID;
            SurveyDataService.conditionNumber++;
            return url;
        };
        SurveyDataService.getSurveyDataCount = function(beginDate,endDate,callbackSuccess,callbackError) {
            var url = selectedENV.apiURL+"/SurveyDatas/count?access_token="+selectedENV.accessToken;
            url = SurveyDataService.getQueryUrl(beginDate,endDate);
            $http.get(url)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };
        SurveyDataService.getSurveyDataByClaimId = function(id,callbackSuccess,callbackError) {
            var url = selectedENV.apiURL +"/SurveyDatas?filter[where][claim_objectId]="+ id +"&access_token="+selectedENV.accessToken;
            $http.get(url)
                .success(function(res){
                    callbackSuccess(res);
                })
                .error(function(error){
                    callbackError(error);
                });
        };
        return SurveyDataService;
    }]).factory('MetricsDataService',['$http',function($http){
        var MetricsDataService = {};
        MetricsDataService.getMetricsDataByClaimId = function(id,callbackSuccess,callbackError) {
            var url = selectedENV.apiURL +"/MetricsDatas?filter[order]=createdDate%20ASC&filter[where][claim_objectId]="+id +"&access_token="+selectedENV.accessToken;
            console.log(url);
            $http.get(url).success(function(response){
                callbackSuccess(response);
            }).error(function(error){
                callbackError(error);
            });
        };
        MetricsDataService.saveMetrics = function(eventName, claimId,callbackSuccess,callbackError) {
            var url = selectedENV.apiURL + "/MetricsDatas?access_token="+selectedENV.accessToken;
            $http.post(url,{
                eventName:eventName,
                orgId:selectedENV.orgID,
                appName:getAppName(selectedENV.orgID),
                claim_objectId: claimId
            }).success(function(){
                callbackSuccess();
            }).error(function(){
                callbackError();
            });
        };
        return MetricsDataService;
    }]).factory('AttachmentService',['$http',function($http){
        var AttachmentService = {};
        return AttachmentService;
    }]).factory('CommErrorsService',['$http',function($http){
        var CommErrorsService = {};
        return CommErrorsService;
    }]).factory('NavigateService',['$http',function($http){
        var NavigateService = {};
        NavigateService.changeNavTab = function(tabNumber) {
            NavigateService.selectedTab = tabNumber;
        };
        return NavigateService;
    }]);