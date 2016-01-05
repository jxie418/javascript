var MBE_ENV_DATA = [
    {
        envName: "(Dev) GTD Liberty Mutual",
        apiURL:"https://mobile-dev.audaexplore.com/api",
        accessToken:"hJDl3JZb5xCkcZCpfADqqKRTNo2EgwMD",
        orgID :"297",
        value:0
    },
    {
        envName: "(Dev) GTD StateFarm",
        apiURL:"https://mobile-dev.audaexplore.com/api",
        accessToken:"hJDl3JZb5xCkcZCpfADqqKRTNo2EgwMD",
        orgID :"477",
        value:1
    },
    {
        envName: "(QA) GTD StateFarm",
        apiURL:"https://mobile-int1.audaexplore.com/api",
        accessToken:"nmdns7eFt3F2gY2DVUpFxi3pDv7j9lju",
        orgID :"477",
        value:2
    },
    {
        envName: "(CAE) GTD StateFarm",
        apiURL:"https://mobile-cae.audaexplore.com/api",
        accessToken:"QLwxIFu1IjPqD3GjFOkRytvBUwghIMBB",
        orgID :"477",
        value:3
    },
    {
        envName: "(PROD) GTD StateFarm",
        apiURL:"https://mobile.audaexplore.com/api",
        accessToken:"Z6IwGI8JrtNwHvTD731wt4By4ffgds4F",
        orgID :"477",
        value:4
    }
];
var selectedENV = {};
var loginUser = '';
var opts = {
    lines: 10, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: '500' // Left position relative to parent in px
};
var pageCenter = document.getElementById('center');
var spinner = new Spinner(opts);