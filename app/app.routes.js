(function() {
    'use strict';

    var rr = angular.module('lokust');
    rr.requires.push('lokust.routes');

    angular
        .module('lokust.routes', ['ui.router'])
        .config(Routes);

    Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Routes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('simulator', {
                url: '/simulator',
                templateUrl: '../app/index.html',
                controller: 'simCtrl',
                controllerAs: 'sim'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '../app/dashboard/dashboard.html',
                controller: 'dashboardCtrl',
                controllerAs: 'dashboard'
            })

        $urlRouterProvider.otherwise('/overview');
    }

})();