'use strict';

/**
 * @ngdoc service
 * @name moviesApp.Movies
 * @description
 * # Movies
 * Factory in the moviesApp.
 */
 angular.module('moviesApp')
 .factory('Movies',['$http','$q', function ($http,$q) {
  return {
    getMovies: function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        // url: "../list.json",
        url: "http://localhost:8081/movies",
        data: '',
        'async': true,
        'cache': false,
        'global': false,
        headers: {}
      }).then(function(response) {
        deferred.resolve(response.data);
      })
      .catch(function(response, status) {
        var rejection = {
          response: response,
          status: status
        }
        deferred.reject(rejection);
      });

      return deferred.promise;
    },
    getMovieDetails: function(data) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: "http://localhost:8081/details/"+data,
        data: '',
        'async': true,
        'cache': false,
        'global': false,
        headers: {}
      }).then(function(response) {
        deferred.resolve(response.data);
      })
      .catch(function(response, status) {
        var rejection = {
          response: response,
          status: status
        }
        deferred.reject(rejection);
      });

      return deferred.promise;
    },
    getCastPic: function(data) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: "http://localhost:8081/moviesCast/"+data,
        data: '',
        'async': true,
        'cache': false,
        'global': false,
        headers: {}
      }).then(function(response) {
        deferred.resolve(response.data);
      })
      .catch(function(response, status) {
        var rejection = {
          response: response,
          status: status
        }
        deferred.reject(rejection);
      });

      return deferred.promise;
    }
  };
}]);
