(function (angular) {
    'use strict';

    function MessageService($timeout, bbModal, bbToast) {
        var service;

        service = this;

        function Messenger(options) {
            var defaults,
                settings,
                toInject;

            toInject = ['icon', 'link', 'linkText', 'message', 'requestLogin'];
            defaults = {
                templateUrl: "../public/app/components/toasts/toast.html",
                controller: "ToastMessageController as toastCtrl",
                requestLogin: false
            };

            if (typeof options !== 'object') {
                options = {
                    message: angular.copy(options)
                };
            }

            settings = angular.merge({}, defaults, options);

            if (settings.requestLogin) {
                settings.link = function () {
                    bbModal.open({
                        controller: 'LoginModalController as contentCtrl',
                        templateUrl: '../public/app/components/modals/login-modal.html'
                    });
                };
                settings.linkText = 'Please login';
            }

            function set(key, value) {
                settings[key] = value;
            }

            function showMessage() {
                var data,
                    k;

                data = {};

                for (k in settings) {
                    if (settings.hasOwnProperty(k)) {
                        if (toInject.indexOf(k) > -1) {
                            data[k] = angular.copy(settings[k]);
                            delete settings[k];
                        }
                    }
                }

                settings.resolve = {
                    data: function () {
                        return data;
                    }
                };

                bbToast.open(settings);
            }

            return {
                set: set,
                settings: settings,
                showMessage: showMessage
            };
        }

        service.closeAll = function () {
            $timeout(function () {
                angular.element('.toast-close-button').trigger('click');
            });
        };

        service.info = function (options) {
            var messenger;
            messenger = new Messenger(options);
            messenger.set('toastType', 'info');
            messenger.showMessage();
        };

        service.error = function (options) {
            var messenger;
            messenger = new Messenger(options);
            messenger.set('toastType', 'danger');
            messenger.set('icon', 'fa-warning');
            messenger.showMessage();
        };

        service.success = function (options) {
            var messenger;
            messenger = new Messenger(options);
            messenger.set('toastType', 'success');
            messenger.set('icon', 'fa-check');
            messenger.showMessage();
        };

        service.handleError = function (error) {
            if (!error) {
                return;
            }
            if (typeof error === 'string') {
                service.error(error);
            } else if (error.status === 401) {
                service.info({
                    message: error.data.message,
                    requestLogin: true
                });
            } else {
                service.error({
                    message: error.data.message
                });
            }
        };

        service.handleSuccess = function (options) {
            if (typeof options === 'string') {
                service.success(options);
            } else {
                service.success({
                    message: options.messageText || 'Success!',
                    link: options.link || 'home',
                    linkText: options.linkText || 'Return home'
                });
            }
        };
    }

    MessageService.$inject = [
        '$timeout',
        'bbModal',
        'bbToast'
    ];

    angular.module('capabilities-catalog')
        .service('MessageService', MessageService);
}(window.angular));
