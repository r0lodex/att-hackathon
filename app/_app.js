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
        root.action = action;
        root.counter = 10;
        var t = new Date('2017-08-11');

        function action(type) {
            root.counter = root.counter+10;
            var v = 0;
            t.setMinutes(t.getMinutes() + root.counter);

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
                    console.log(response);
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