'use strict';

angular.module('xstApp')
    .factory("$api", [function () {
        const url = "http://localhost:8088";
        return {
            getUserInfo: `${url}/api/user_info`,
        }

    }]);
