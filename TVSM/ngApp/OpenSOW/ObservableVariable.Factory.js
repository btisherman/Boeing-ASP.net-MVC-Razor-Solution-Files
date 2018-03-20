(function () {
    angular.module('OpenSOW')

    .factory('ObservableVariable', ['$q', function ($q) {
        
        var deferred = $q.defer();
        var variable = function (val) {
            this.value = val;
        }

        variable.prototype.get = function () {
            return this.value;
        }

        variable.prototype.set = function (val) {
            this.value = val;
            deferred.notify(val);
        }

        variable.prototype.changed = deferred.promise;

        return variable;
    }]);
})();