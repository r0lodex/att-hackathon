(function() {
    'use strict';

    var rr = angular.module('lokust');
    rr.requires.push('lokust.dashboard');

    angular
        .module('lokust.dashboard', ['angular-flot'])
        .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = [];

    function dashboardCtrl() {
        var dash = this;
        dash.image_url = 'https://api-m2x.att.com/v2/charts/5386801285c987ca080a422f8455a076.png?width=800&height=600&type=values';
        refreshImage();

        function refreshImage() {
            // window.location.reload();
            setTimeout(refreshImage, 50000);
        }
    }

})();