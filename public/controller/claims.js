/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AllClaimsController',['$scope','ClaimService','$state','$http','NavigateService', function($scope, ClaimService,$state,$http,NavigateService){
        $scope.errorMsg ="";
        $scope.claimList =[];
        $scope.totalClaimCount = 0;
        $scope.claimPerPage = 100;
        $scope.currentPage = 1;
        $scope.totalPages = 1;
        $scope.pageList =[];
        $scope.chartLabels=["Uncommitted Claims","Submitted Claims"];
        $scope.chartData=[];
        $scope.sortType     = 'createdDate'; // set the default sort type
        $scope.sortReverse  = true;

        NavigateService.selectedTab = 0;

        $scope.pageChanged = function(newPage) {
            getResultsPage(newPage);
        };

        $scope.closeErrorMsg = function() {
            $scope.errorMsg ="";
        };
        $scope.datepickerInti=function(event) {
            var view = this;
            $(event.currentTarget).datepicker({
                orientation: "bottom auto",
                autoclose: true,
                todayHighlight: true,
                dateFormat:'yy-mm-dd',
                defaultDate:view.selectedDate,
                onSelect:function(dateText,datePicker) {
                    view.selectedDate = dateText;
                }
            });
        };

        $scope.search = function() {
            getResultsPage(1);
        };

        var getDataFromServer = function(url) {
            $http.get(url).success(function(res){
                spinner.stop();
                if(res.length == 0) {
                    $scope.errorMsg="Error can't find the claim " + $scope.searchClaimNumber;
                } else {
                    $scope.claimList = res;
                }

            }).error(function(error){
                spinner.stop();
                $scope.errorMsg="Error occurred on server side.";
            });
        };

        $scope.isSelectedPage = function(pageNunber) {
            return $scope.currentPage == pageNunber;
        };

        var getResultsPage= function(pageNumber){
            spinner.spin(pageCenter);
            var beginDate = this.$("#searchStartDate").val();
            beginDate = trimString(beginDate);
            var endDate = this.$("#searchEndDate").val();
            endDate = trimString(endDate);
            var url = selectedENV.apiURL+"/Claims/count?access_token="+selectedENV.accessToken;
            var urlSubmit = selectedENV.apiURL+"/Claims/count?access_token="+selectedENV.accessToken;
            var urlSurvey = selectedENV.apiURL+"/SurveyDatas/count?access_token="+selectedENV.accessToken;
            var requestUrl = selectedENV.apiURL +"/Claims?filter[order]=createdDate%20DESC";

            var condtionNumber = 0;
            var surveyCount = 0;

            if (typeof ($scope.searchClaimNumber) !== 'undefined' && $scope.searchClaimNumber !=='') {
                url += "&where[and]["+condtionNumber+"][claimNumber][like]="+""+$scope.searchClaimNumber.toString()+"";
                requestUrl+="&filter[where][and]["+condtionNumber+"][claimNumber][like]="+""+$scope.searchClaimNumber.toString()+"";
                urlSubmit+="&where[and]["+condtionNumber+"][claimNumber][like]="+""+$scope.searchClaimNumber.toString()+"";
                condtionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&where[and]["+condtionNumber+"][createdDate][gt]="+beginDate;
                requestUrl +="&filter[where][and]["+condtionNumber+"][createdDate][gt]="+beginDate;
                urlSubmit+="&where[and]["+condtionNumber+"][createdDate][gt]="+beginDate;
                urlSurvey+="&where[and]["+surveyCount+"][createdDate][gt]="+beginDate;
                condtionNumber++;
                surveyCount++;
                url += "&where[and]["+condtionNumber+"][createdDate][lt]="+endDate;
                requestUrl+= "&filter[where][and]["+condtionNumber+"][createdDate][lt]="+endDate;
                urlSubmit+="&where[and]["+condtionNumber+"][createdDate][lt]="+endDate;
                urlSurvey+="&where[and]["+condtionNumber+"][createdDate][lt]="+endDate;
                surveyCount++;
                condtionNumber++;
            }
            urlSubmit +="&where[and]["+condtionNumber+"][customerStatus][gt]=4";
            url +="&where[and]["+condtionNumber+"][orgId]="+selectedENV.orgID;
            urlSurvey+="&where[and]["+surveyCount+"][orgId]="+selectedENV.orgID;
            requestUrl+="&filter[where][and][0][orgId]="+selectedENV.orgID;
            condtionNumber++;
            urlSubmit +="&where[and]["+condtionNumber+"][orgId]="+selectedENV.orgID;

            console.log(url);
            $scope.currentPage = pageNumber;
            if($scope.currentPage == 1) {
                $http.get(url).success(function(response){
                    $scope.totalClaimCount = response.count;
                    $scope.totalPages = $scope.totalClaimCount/$scope.claimPerPage;
                    $scope.totalPages = Math.ceil($scope.totalPages);
                    iniPages($scope);
                    $http.get(urlSubmit).success(function(submitdata){
                        $scope.totalSubmit=submitdata.count;
                        $scope.percentageSubmitted=(submitdata.count*100)/$scope.totalClaimCount;
                        $scope.percentageSubmitted =  Math.round($scope.percentageSubmitted*10)/10;
                        $scope.chartData.push(100-$scope.percentageSubmitted);
                        $scope.chartData.push($scope.percentageSubmitted);
                        $http.get(urlSurvey).success(function(surveydata){
                            $scope.surveysSubmitted=surveydata.count;
                            $scope.percentageSurveysSubmitted=(surveydata.count*100)/$scope.totalSubmit;
                            $scope.percentageSurveysSubmitted = Math.round($scope.percentageSurveysSubmitted*10)/10;
                        }).error(function(){
                            $scope.errorMsg ="Error: can't get count for submitted survey claims.";
                        });
                    }).error(function(){
                        $scope.errorMsg ="Error: can't get count for submitted claims.";
                    });
                }).error(function(){
                    $scope.errorMsg ="Error: can't get count of the claims.";
                });
            } else {
                iniPages($scope);
            }

            var skipNumber = parseInt(($scope.currentPage -1) * $scope.claimPerPage);

            requestUrl +='&filter[skip]='+skipNumber;
            requestUrl +='&filter[limit]='+$scope.claimPerPage;
            requestUrl +="&access_token="+selectedENV.accessToken;
            console.log(requestUrl);
            getDataFromServer(requestUrl);
        };

        getResultsPage(1);

        $scope.getVehicle = function(claim) {
            var year = (claim.estimateVehicleYear == null ? "" : claim.estimateVehicleYear);
            var make = (claim.estimateVehicleMake == null? "" : claim.estimateVehicleMake);
            var model = (claim.estimateVehicleModel == null ? "" : claim.estimateVehicleModel);

            var output = year;
            if(make.length > 0){
                output = output + " " + make;
            }
            if(model.length > 0){
                output = output + " " + model;
            }
            return output;
        };
        $scope.getClaimStatus = function(claim) {
            return getClaimStatus(claim);
        };
        $scope.selectClaim = function(claim) {
            ClaimService.selectOneClaim(claim);
        };

    }])
    .controller('ClaimDetailsController',['$scope','$http','ClaimService','SurveyDataService','MetricsDataService','AttachmentService','NavigateService',
        '$stateParams','$state',function($scope,$http,ClaimService,Claim,SurveyDataService,MetricsDataService,AttachmentService,NavigateService,$stateParams,$state){
            NavigateService.selectedTab = -1;
            var id = ClaimService.selectedClaim.id;
            console.log(id);
            $scope.claim =ClaimService.selectedClaim;
            $scope.errorMsg ="";
            $scope.successMsg="";
            $scope.uploadErrorMsg="";
            $scope.eventList=[];
            $scope.surveyDatas={};
            $scope.submitedImages=[];
            $scope.showMetricsflag = true;
            $scope.searchEventName="";
            $scope.sortType= 'createdDate'; // set the default sort type
            $scope.sortReverse=true;

            $scope.communications=[{value:0,name:"Email"},{value:1,name:"Text"},{value:2,name:"Email and Text"},{value:3,name:"None"}];
            var initial = function() {
                spinner.spin(pageCenter);
                ClaimService.load(function(response){
                    spinner.stop();
                    $scope.claim = response;
                },function(){
                    spinner.stop();
                    $scope.errorMsg ="Can't get claim from server. Please try it later.";
                });
            };
            var initialMetricsData = function() {
                var url = selectedENV.apiURL +"/MetricsDatas?filter[order]=createdDate%20ASC&filter[where][claim_objectId]="+id +"&access_token="+selectedENV.accessToken;
                console.log(url);
                spinner.spin(pageCenter);
                $http.get(url).success(function(response){
                    spinner.stop();
                    $scope.eventList = response;
                }).error(function(error){
                    spinner.stop();
                    $scope.errorMsg ="Can't get metric data from server. Please try it later.";
                });
            };
            initialMetricsData();
            var initialSurveyData = function() {
                var url = selectedENV.apiURL +"/SurveyDatas?filter[where][claim_objectId]="+ id +"&access_token="+selectedENV.accessToken;
                console.log(url);
                spinner.spin(pageCenter);
                $http.get(url).success(function(response){
                    spinner.stop();
                    $scope.surveyDatas = response[0];
                }).error(function(error){
                    spinner.stop();
                    $scope.errorMsg ="Can't get survey data from server. Please try it later.";
                });
            };
            initialSurveyData();
            var downloadImageContent = function(photo,times) {
                var url = selectedENV.apiURL +"/Attachments/downloadImage?file="+ photo.file +"&access_token="+selectedENV.accessToken;
                spinner.spin(pageCenter);
                $http.get(url).success(function(photoContent){
                    spinner.stop();
                    photo.content = photoContent.content;
                }).error(function(error){
                    spinner.stop();
                    times++;
                    if(times < 3) {
                        downloadImageContent(photo,times);
                    }
                });
            };
            var chunk = function (arr, size) {
                var newArr = [];
                for (var i=0; i<arr.length; i+=size) {
                    newArr.push(arr.slice(i, i+size));
                }
                return newArr;
            };
            var initialSubmitedImage = function() {
                var url = selectedENV.apiURL +"/Attachments?filter[where][and][0][claim_objectId]="+ id +"&filter[where][and][1][attachmentType]=UserUpload&access_token="+selectedENV.accessToken;
                spinner.spin(pageCenter);
                $http.get(url).success(function(response){
                    spinner.stop();
                    //$scope.submitedImages = response;
                    response.forEach(function(photo) {
                        downloadImageContent(photo,0);
                    });
                    $scope.submitedImages = chunk(response, 3);
                }).error(function(error){
                    spinner.stop();
                    $scope.errorMsg ="Can't get submitted images  from server. Please try it later.";
                });
            };

            var saveMetrics = function(eventName, claimId) {
                var url = selectedENV.apiURL + "/MetricsDatas?access_token="+selectedENV.accessToken;
                console.log(url);
                spinner.spin(pageCenter);
                $http.post(url,{
                    eventName:eventName,
                    orgId:selectedENV.orgID,
                    appName:getAppName(selectedENV.orgID),
                    claim_objectId: $scope.claim.id
                }).success(function(){
                    spinner.stop();
                    console.log("Save Metrics success.");
                }).error(function(){
                    spinner.stop();
                    console.log("Save Metrics data fail.");
                });
            };

            var updateRemoteClaim = function() {
                var url = selectedENV.apiURL+"/Claims/"+id+"?access_token="+selectedENV.accessToken;
                spinner.spin(pageCenter);
                $http.put(url,$scope.claim).success(function(response){
                    spinner.stop();
                    $scope.claim = response;
                }).error(function(error){
                    spinner.stop();
                    $scope.errorMsg ="Update claim error happened on server. Please try it later.";
                });
            };


            initialSubmitedImage();
            $scope.displayLargePhoto = function(image)
            {
                var myWindow = window.open("", "LargePhoto", "width=600, height=480");
                myWindow.document.write("<html><head><title>LargePhoto</title></head><body height=\"100%\" width=\"100%\"><img src=\'data:image/png;base64," + image + "\'/></body></html>");
            }
            $scope.closeErrorMsg = function() {
                $scope.errorMsg ="";
            };
            $scope.closeSuccessMsg = function() {
                $scope.successMsg = "";
            };
            $scope.updateClaim = function() {
                console.log($scope.claim.vehicleOwnerEmail);
                console.log($scope.claim.vehicleOwnerCellPhone);
                console.log($scope.claim.communicationPreference);
                updateRemoteClaim();
            };

            $scope.getEstimateNetTotal = function() {
                if(isPositiveNumber($scope.claim.estimateNetTotal)) {
                    return $scope.claim.estimateNetTotal
                }   else {
                    return 0;
                }
            };
            $scope.resendpasscode = function() {
                var url = selectedENV.apiURL +"/Claims/resendInviteToVehicleOwner?id="+ id +"&access_token="+selectedENV.accessToken;
                var claimNumber = $scope.claim.claimNumber;
                console.log(url);
                spinner.spin(pageCenter);
                $scope.errorMsg = "";
                $scope.successMsg ="";
                $http.get(url).success(function(){
                    spinner.stop();
                    if (typeof(data) === 'undefined' || data === null || typeof(data.error) !== 'undefined') {
                        $scope.errorMsg ="Failed to resend passcode for claim " + claimNumber + ".\nError: nothing return from server. ";
                    } else {
                        saveMetrics('SupportSite_ResendPasscode_ButtonClicked',id);
                        $scope.successMsg ="Successfully resend passcode for claim " + claimNumber;
                    }
                }).error(function(error){
                    spinner.stop();
                    $scope.errorMsg = "Failed to resend passcode for claim " + claimNumber + ".\nError: " + error.message;
                });
            };
            $scope.hideMetrics = function() {
                $scope.showMetricsflag = false;
            };
            $scope.showMetrics = function() {
                $scope.showMetricsflag = true;
            };

            $scope.resendestimate = function() {
                $scope.claim.customerStatus = 6;
                updateRemoteClaim();
                saveMetrics('SupportSite_ResendEstimate_ButtonClicked',id);
            };
            $scope.cancel = function() {
                initial();
            };
            $scope.getClaimStatus = function(claim) {
                return getClaimStatus(claim);
            };
            $scope.openDialog = function(id) {
                var filesSelected = $("#estimateReportInput").prop("files");
                if (typeof (filesSelected) !== 'undefined' && filesSelected.length > 0) {
                    $("#"+id+"").modal({
                        show:true
                    });
                    $scope.errorMsg="";
                } else {
                    $scope.errorMsg="Please select estimate report.";
                }
            };
            $scope.closeDialog = function(id) {
                $("#"+id+"").modal({
                    show:false
                });
                initial();
            };
            $scope.uploadestimatereport = function() {
                var filesSelected = $("#estimateReportInput").prop("files");
                if (typeof (filesSelected) !== 'undefined' && filesSelected.length > 0) {
                    if(isPositiveNumber($scope.claim.estimateNetTotal)) {
                        $scope.uploadErrorMsg="";
                        var fileToLoad = filesSelected[0];
                        var fileReader = new FileReader();
                        fileReader.onload = function(fileLoadedEvent) {
                            var srcData = fileLoadedEvent.target.result;
                            var reportData = btoa(srcData);
                            var url = selectedENV.apiURL +"/Attachments/saveEstimateReport?access_token="+selectedENV.accessToken;
                            console.log(url);
                            spinner.spin(pageCenter);
                            $http.post(url,{
                                data:reportData,
                                fileName:"estimatereport.pdf",
                                attachmentType:"estimatereport",
                                taskId:$scope.claim.taskId
                            }).success(function(){
                                spinner.stop();
                                $scope.claim.customerStatus = 6;
                                updateRemoteClaim();
                                $("#estimateNetTotalDialog").modal({
                                    show:false
                                });
                                $("#estimateReportInput").replaceWith($("#estimateReportInput").clone());
                                saveMetrics('SupportSite_ManuallyAttachEstimate_EstimateAttached',id);
                            }).error(function(){
                                $scope.uploadErrorMsg="upload estimate report error happened on server. Please try it later!";
                            });
                        }
                        fileReader.readAsBinaryString(fileToLoad);
                    } else {
                        $scope.uploadErrorMsg="Please input right estimate gross total.";
                    }
                }
            }
        }])
    .controller('navController',function($scope,$state,AuthService,NavigateService){
        $scope.isActive = function(tabNum) {
            return NavigateService.selectedTab == tabNum;
        };

        $scope.changeNavTab = function(tabNum) {
            NavigateService.changeNavTab(tabNum);
        };

        $scope.logout = function() {
            loginUser = '';
            spinner.stop();
            AuthService.logout();
            $state.go('login');
        }
    });