(function() {
    'use strict';

    angular
        .module('lokust', ['ngResource'])
        .factory('HeaderInjection', HeaderInjection)
        .factory('m2x', m2x)
        .controller('rootCtrl', rootCtrl);

    HeaderInjection.$inject = ['$q', '$rootScope'];
    m2x.$inject = ['$resource'];
    rootCtrl.$inject = ['$rootScope', 'm2x'];

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
        return $resource(
            'https://api-m2x.att.com/v2/:action/:device_id/:type',
            { action: '@action', device_id: '@device_id', type: '@type' },
            { send: { method: 'PUT' } }
        )
    }

    function rootCtrl($rootScope, m2x) {
        var root = this;
        root.motion = motion;
        root.action = action;
        root.counter = 0;

        m2x.get({ action: 'status' }, function(response) {
            console.log(response);
        })

        $(window).on('devicemotion', root.motion);

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', root.motion, true);
        } else {
            root.error = console.log('DeviceMotionEvent is not supported')
        }

        function motion(event){
            root.data = [ event.acceleration.z ];
        }

        function action(type) {
            root.type = type;
            root.counter++;
        }
    }


})();