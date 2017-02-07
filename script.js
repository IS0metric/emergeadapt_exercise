var app = angular.module('app', ['ngRoute']);

// Configure Routing
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
        templateUrl : 'pages/page1.html',
        controller  : 'mainController'
    })
    .when('/page2', {
        templateUrl : 'pages/page2.html',
        controller  : 'aboutController'
    })
    .when('/page3', {
        templateUrl : 'pages/page3.html',
        controller  : 'page3Controller'
    });
});

//
app.service('saveData', function() {
  var reference_number;
  var data;
  var enquiry;

  var setRef = function(_ref) {
    reference_number = _ref;
  };

  var getRef = function() {
    return reference_number;
  };

  var setData = function(_data) {
    console.log("DATA SET");
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
    setRef: setRef,
    getRef: getRef,
  };
});

app.controller('mainController', function($scope, $http, $location, saveData) {
  $scope.client_reference = 29;
  $scope.myFunction = function() {
    var ref_number = $scope.client_reference;
    $http({
      method: "GET",
      url: "https://login.caseblocks.com/case_blocks/search?query=client_reference:"+ref_number+"&auth_token=bDm1bzuz38bpauzzZ_-z"
    }).then(function successCallback(response) {
      saveData.setData(response.data);
      $location.path("/page2");
    });
  }

});

app.controller('aboutController', function($scope, $location, saveData) {
  $scope.load_success = true;
  $scope.data_found = true;
  var data = saveData.getData();
  var client_case;
  var client_enquiry_case;
  console.log(data);
  if (data === undefined) {
    $scope.load_success = false;
    $scope.empty_message = "Failed to load data";
  } else if (data.length == 0) {
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
      var not_found = true;
      for (n in client_case.cases) {
        var current_case = client_case.cases[n];
        if (current_case.client_name) {
          not_found = false;
          $scope.client_name = current_case.client_name;
        }
      }
      if (not_found) {
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
          var enquiry = {
            id: id++,
            created_at: current_case.created_at.slice(0, 10),
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
    $location.path("/page3");
  }
});

app.controller('page3Controller', function($scope, saveData) {
  $scope.enquiry = saveData.getEnquiry();
});
