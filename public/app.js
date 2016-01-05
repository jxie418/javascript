angular
    .module('mbeapp', [
        'ui.router',
        'ngRoute',
        'chart.js'
    ])
    .config(['$stateProvider', '$urlRouterProvider','$routeProvider',
        function($stateProvider, $urlRouterProvider,$routeProvider) {

            $routeProvider
                .when('/',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/login',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/all-claims',{
                    templateUrl:'views/all-claims.html',
                    controller: 'AllClaimsController',
                    authenticate:true
                })
                .when('/commerrors',{
                    templateUrl:'views/comerrors.html',
                    controller:'AllCommErrorsController',
                    authenticate:true
                })
                .when('/claim-details',{
                    templateUrl:'views/claim-details.html',
                    controller: 'ClaimDetailsController',
                    authenticate: true
                })
                .when('/forbidden',{
                    templateUrl:'views/forbidden.html'
                })
                .otherwise({
                    redirectTo:'/'
                });

            $stateProvider
                .state('all-claims', {
                    url: '/all-claims',
                    templateUrl: 'views/all-claims.html',
                    controller: 'AllClaimsController',
                    authenticate:true
                })
                .state('commerrors', {
                    url: '/commerrors',
                    templateUrl: 'views/comerrors.html',
                    controller: 'AllCommErrorsController',
                    authenticate:true
                })
                .state('claim-details', {
                    url: '/claim-details',
                    templateUrl: 'views/claim-details.html',
                    controller: 'ClaimDetailsController',
                    authenticate: true
                })
                .state('forbidden', {
                    url: '/forbidden',
                    templateUrl: 'views/forbidden.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'AuthLoginController'
                });
            $urlRouterProvider.otherwise('login');
        }])
    .run(['$rootScope', '$state', '$location', function($rootScope, $state,$location) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
            // redirect to login page if not logged in
            if (next.authenticate && !$rootScope.currentUser) {
                event.preventDefault(); //prevent current page from loading
                $state.go('forbidden');
            }
        });
    }]);
