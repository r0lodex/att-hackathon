(function() {
    'use strict';

    angular
        .module('lokust', ['ngResource'])
        .config(Config)
        .factory('HeaderInjection', HeaderInjection)
        .factory('m2x', m2x)
        .controller('rootCtrl', rootCtrl)
        .controller('simCtrl', simCtrl);

    Config.$inject = ['$httpProvider'];
    HeaderInjection.$inject = ['$q', '$rootScope'];
    m2x.$inject = ['$resource'];
    rootCtrl.$inject = ['$rootScope', 'm2x', '$resource'];
    simCtrl.$inject = [];

    function Config($httpProvider) {
        $httpProvider.interceptors.push('HeaderInjection');
    }

    function HeaderInjection($q, $rootScope) {
        return {
            request: function(config) {
                config.headers['X-M2X-KEY'] = '291f94755ba2c6948a126ed4d098aee3';

                return config || $q.when(config);
            },
            success: function(response) {
                return response || $q.when(response);
            },
            response: function(response) {
                return response || $q.when(response);
            },
            error: function(response) {
                if (response.status === 401) {
                    $rootScope.$broadcast('XHR:LoginRequired');
                } else {
                    $rootScope.$broadcast('XHR:Error', response);
                }
                return $q.reject(response);
            },
            responseError: function(rejection) {
                if (rejection.data.messages.length) {
                    if (rejection.status === 401) {
                        $rootScope.$broadcast('XHR:LoginRequired');
                    } else {
                        rejection.data.messages.forEach(function(v) {
                            console.warn('Server Error: ' + v.text);
                        });
                    }
                } else {
                    $rootScope.$broadcast('XHR:Error', rejection)
                }

                return $q.reject(rejection);
            }
        }
    }

    function m2x($resource) {
        return $resource('https://api-m2x.att.com/v2/devices/61e452568f021278e6e5bcfbfe57399f/streams/elev2/value', {}, { send: { method: 'PUT' } });
    }

    function rootCtrl($rootScope, m2x, $resource) {
        var root = this;
        root.rootscope = $rootScope;
        root.stream = { channel: 'dghcktn_channel' };
        root.action = action;
        root.counter = 10;
        root.loc_counter = 0;
        
        var t = new Date('2017-08-11');
        var pubnub = new PubNub({
            publishKey: 'pub-c-38ebf9a8-1a5a-4914-91fa-ae24e95a844e',
            subscribeKey: 'sub-c-5b21cd86-747c-11e7-8153-0619f8945a4f'
        });

        function _publish(message, callback) {
            root.stream.message = message;
            pubnub.publish(root.stream, function(status, response) {
                console.log(status, response);
                if (callback) {
                    callback(status, response);
                }
            });
        }

        function action(type) {
            root.counter = root.counter+10;
            var v = 0;
            t.setMinutes(t.getMinutes() + root.counter);
            var locations = [
                [2.921713, 101.665888],
                [2.921370, 101.666227],
                [2.920299, 101.666860],
                [2.919667, 101.667160],
                [2.918435, 101.667664],
                [2.917814, 101.667954],
                [2.916469, 101.668528],
                [2.915810, 101.668684],
                [2.915510, 101.668797],
                [2.914997, 101.668885]
            ]

            root._locations = [];

            console.log(t);

            switch(type) {
                case 'walk':
                    v = _getRand(4, 6);
                break;
                case 'jump':
                    v = _getRand(30, 40);
                break;
            }

            m2x.send({ timestamp: t.toISOString(), value: v },
                function(response) {
                    root.loc_counter = (root.loc_counter == 9) ? root.loc_counter-1 : root.loc_counter+1;
                    console.log(root.loc_counter);
                    _publish(JSON.stringify(locations[root.loc_counter]));
                }
            );
        }

        function _getRand(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
    }

    function simCtrl() {
        var sim = this;
    }


})();