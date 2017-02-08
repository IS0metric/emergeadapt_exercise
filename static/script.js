var app = angular.module('app', ['ngRoute']);

// Configure Routing
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
        templateUrl : 'pages/main.html',
        controller  : 'mainController'
    })
    .when('/case', {
        templateUrl : 'pages/case.html',
        controller  : 'caseController'
    })
    .when('/message', {
        templateUrl : 'pages/message.html',
        controller  : 'messageController'
    });
});

// Conficure saveData service
// allows getting and setting data to be used between controllers
app.service('saveData', function() {
  var data;
  var enquiry;

  var setData = function(_data) {
    data = _data;
  };

  var getData = function() {
    return data;
  };

  var setEnquiry = function(_enquiry) {
    enquiry = _enquiry;
  };

  var getEnquiry = function() {
    return enquiry;
  };

  return {
    setData: setData,
    getData: getData,
    setEnquiry: setEnquiry,
    getEnquiry: getEnquiry,
  };
});

app.controller('mainController', function($scope, $http, $location, saveData) {
  $scope.error;
  $scope.client_reference = 29;
  $scope.getFunction = function() {
    var ref_number = $scope.client_reference;
    if (ref_number == null) {
      $scope.error = "Invalid input";
    } else {
      // I attempted to parameterize the client reference and auth token, but
      // for some reason whenever I did, I got CORS errors
      $http.get("https://login.caseblocks.com/case_blocks/search?query=client_reference:"+ref_number+"&auth_token=bDm1bzuz38bpauzzZ_-z")
      .then(function successCallback(response) {
        saveData.setData(response.data);
        $location.path("/case");
      });
    }
  }

});

app.controller('caseController', function($scope, $location, saveData) {
  $scope.load_success = true;
  $scope.data_found = true;
  var data = saveData.getData();
  var client_case;
  var client_enquiry_case;
  if (data === undefined) {
    // catches a failed http request or corrupt data
    $scope.load_success = false;
    $scope.empty_message = "Failed to load data";
  } else if (data.length == 0) {
    // catches cases where no data is returned
    $scope.data_found = false;
    $scope.no_data_message = "No data found";
  } else {
    for (i in data) {
      if (data[i].case_type_id == 323) {
        client_case = data[i];
      } else if (data[i].case_type_id == 327) {
        client_enquiry_case = data[i];
      }
    }

    if (client_case !== undefined){
      // if a client case is not undefined
      var not_found = true;
      for (n in client_case.cases) {
        var current_case = client_case.cases[n];
        if (current_case.client_name) {
          not_found = false;
          $scope.client_name = current_case.client_name;
        }
      }
      if (not_found) {
        // if no name can be found in any of the found client cases, change the
        // name value to give a not found message
        $scope.client_name = "Client Name Not Found";
      }
    }

    $scope.enquiry_list = [];
    var full_enquiry_list = {};
    var id = 0;
    if (client_enquiry_case !== undefined){
      for (j in client_enquiry_case.cases) {
        var current_case = client_enquiry_case.cases[j];
        if (current_case.created_at && current_case.enquiry_source) {
          full_enquiry_list[id] = current_case;
          // pass forward an enquiry with the relevant details
          var enquiry = {
            id: id++,
            created_at: current_case.created_at,
            enquiry_source: current_case.enquiry_source,
            message: current_case.message
          };
          $scope.enquiry_list.push(enquiry);
        }
      }
    }
  }

  $scope.enquiryClick = function(id) {
    saveData.setEnquiry(full_enquiry_list[id]);
    $location.path("/message");
  }
});

app.controller('messageController', function($scope, $location, saveData) {
  $scope.enquiry = saveData.getEnquiry();
  $scope.pretty_enquiry = JSON.stringify($scope.enquiry, undefined, 2);

  $scope.back = function() {
    $location.path("/case");
  };
});
