var  getClaimStatus = function(claim) {
    switch(claim.customerStatus){
        case 0:
            return "New claim (0)";

        case 1:
            return "Claim started (1)";

        case 2:
            return "Damage captured (2)";

        case 3:
            return "Photos captured (3)";

        case 4:
            return "Claim reviewed (4)";

        case 5:
            return "Claim submitted (5)";

        case 6:
            return "Estimate ready (6)";

        case 7:
            return "Estimate received (7)";

        case 8:
            return "Survey completed (8)";

        case 9:
            return "Completed (9)";

        case 10:
            return "Appointment Scheduled (10)";

        case 11:
            return "Repair Completed (11)";

        default:
            return "Unknown status";
    }
};

var isPositiveNumber = function(value) {
    return parseFloat(value) > 0 ;
};

var getAppName= function(orgId){
    if (orgId === '477') {
        return "Pocket Estimate";
    } if (orgId === '297'){
        return "Express Est";
    } else {
        return "";
    }
};

var trimString = function  (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

var getTodayDate = function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    return yyyy +'-'+mm+'-'+dd;
};

var iniPages = function(obj) {
    obj.pageList =[];
    if(obj.currentPage > 1 && obj.currentPage <obj.totalPages) {
        if(obj.currentPage-1 >=1) {
            obj.pageList.push(obj.currentPage-1);
        }
        obj.pageList.push(obj.currentPage);
        if(obj.currentPage+1 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+1);
        }
    } else if(obj.currentPage == 1) {
        obj.pageList.push(obj.currentPage);
        if(obj.currentPage+1 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+1);
        }
        if(obj.currentPage+2 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+2);
        }
    } else if (obj.currentPage ==obj.totalPages) {
        if(obj.currentPage-2 >=1) {
            obj.pageList.push(obj.currentPage-2);
        }
        if(obj.currentPage-1 >=1) {
            obj.pageList.push(obj.currentPage-1);
        }
        obj.pageList.push(obj.currentPage);
    }
};

var getQueryUrl = function(claimNumber,beginDate,endDate) {

};