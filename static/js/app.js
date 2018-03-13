var app = angular.module('app', ['  ngSanitize', 'ngResource', 'ngMaterial', 'md.data.table']);


// --------------- Factory ------------------
app.factory('bxFactory', ($http) => {

    var nodeUrl = '../getData/';
    var url = 'https://bx.in.th/api/';

    var factory = {};

    factory.getMarketData = () => {
        return $http.post(nodeUrl, {url: url});
    }

    factory.getCurrencyPairings = () => {
        return $http.post(nodeUrl, {url: url + 'pairing/'})
    }

    factory.getOrderBook = (pairingId) => {
        return $http.post(nodeUrl, {url: url + 'orderbook/?pairing=' + pairingId});
    }

    factory.getRecentTrades = (pairingId) => {
        return $http.post(nodeUrl, {url: url + 'trade/?pairing=' + pairingId})
    }

    return factory;

});

// -------------- Custom filter ----------------
app.filter('removeText', () => {
    return (input) => {
        input = input || '';
        var out = '';
        out = input.replace('THB', '');

        return out.trim();
    }
})


app.controller('mainController', (bxFactory, $scope, $timeout) => {

    $scope.counter = 0;
    $scope.showmore = false;
    $scope.progress = 0;
    $scope.loading = true;
    $scope.quantity = {};
    $scope.quantity.value = 5;
    $scope.marketDataList = [];
    $scope.recentTrades = {};


    bxFactory.getMarketData().then((response) => {
        // console.log(response.data);
        for (var key in response.data) {
            if (response.data[key].primary_currency === 'THB') {
                $scope.marketDataList.push(response.data[key]);
            }
        }

        $scope.promise = $scope.getBxRecentTrades();


    });
    $scope.getBxRecentTrades = () => {
        $scope.marketDataList.forEach((value) => {
            bxFactory.getRecentTrades(value.pairing_id).then((currencyRes) => {
                //console.log(currencyRes.data)
                $scope.recentTrades[value.secondary_currency] = [];
                $scope.recentTrades[value.secondary_currency].push(currencyRes.data);
            });
            $scope.loading = false;

        });
    }

    $scope.promise = $scope.getBxRecentTrades();

    $scope.onReload = () => {
        if ($scope.progress == 100) {
            $scope.promise = $scope.getBxRecentTrades();
            $scope.counter = 0;
            $scope.progress = 0;
            timeout = $timeout($scope.onReload, 100);
        } else {
            $scope.counter++;
            $scope.progress = ($scope.counter * 1) / 3;
            // console.log($scope.progress + '%')
            timeout = $timeout($scope.onReload, 100);
        }

    }

    var timeout = $timeout($scope.onReload, 100);

    //
    // console.log($scope.marketDataList);
    // console.log($scope.recentTrades);

    $scope.getRecentTradesBidWithId = (id, key) => {
        return _.find($scope.recentTrades[key][0], (item) => {
            return item.order_id = id;
        })

    }


    console.log('mainController');
});



