(function() {
    'use strict';

    var rr = angular.module('lokust');
    rr.requires.push('lokust.dashboard');

    angular
        .module('lokust.dashboard', ['ngMap'])
        .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['NgMap'];

    function dashboardCtrl(NgMap) {
        var dash = this;
        dash.getMarkers = getMarkers;
        dash.positions = [];

        NgMap.getMap().then(function(map) {
            dash.map = map;
        });

        var pubnub = new PubNub({
            publishKey: 'pub-c-38ebf9a8-1a5a-4914-91fa-ae24e95a844e',
            subscribeKey: 'sub-c-5b21cd86-747c-11e7-8153-0619f8945a4f'
        });

        pubnub.addListener({
            status: function(statusEvent) {
                if (statusEvent.category === "PNConnectedCategory") {}
            },
            message: function(message) {
                dash.getMarkers(message.message)
            },
            presence: function(presenceEvent) {
                // handle presence
            }
        })      

        pubnub.subscribe({
            channels: ['dghcktn_channel']
        });

        function getMarkers(stream_data) {
            dash.positions.push(JSON.parse(stream_data));
            console.log(dash.positions);
            NgMap.getMap().then(function(map) {
                dash.map = map;
            });
        }
    }

})();