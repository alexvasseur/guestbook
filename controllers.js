var redisApp = angular.module('redis', ['ui.bootstrap']);

/**
 * Constructor
 */
function RedisController() {}

RedisController.prototype.onRedis = function() {
    this.scope_.messages.push(this.scope_.msg);
    
    // use below code if you want to only store a single value with concatenated messages
    //this.scope_.msg = "";
    //var value = this.scope_.messages.join();
    
    var value = this.scope_.msg;
    this.scope_.msg = ""
    
    // use a keyspace and not a single key with value of concatenated strings
    var key = "guestbook:"+Date.now();

    this.http_.get("guestbook.php?cmd=set&key="+key+"&value=" + value)
            .success(angular.bind(this, function(data) {
                this.scope_.redisResponse = "Updated.";
            }));
};

redisApp.controller('RedisCtrl', function ($scope, $http, $location) {
        $scope.controller = new RedisController();
        $scope.controller.scope_ = $scope;
        $scope.controller.location_ = $location;
        $scope.controller.http_ = $http;

        $scope.controller.http_.get("guestbook.php?cmd=getall&key=guestbook:*")
            .success(function(data) {
                console.log(data);
                try {
                    $scope.messages = data.data.split(",");
                } catch (err) {
                    // if PHP error due to Redis connection for example
                    $scope.messages = {data};
                }
            });
});
