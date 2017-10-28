'use strict';

angular.module('moviesApp')
.controller('MainCtrl',['Movies','$scope','$http', function (Movies,$scope,$http) {
	$scope.moviesList = [];
	$('#loader').show();
	$scope.getMovies = function(){
		Movies.getMovies().then(function(result) {
			$('#loader').hide();
			$scope.moviesList = result.movies;

			/*setTimeout(function(){
				$('.movieList').first().trigger('click')
			},200)*/


		}).catch(function(reason) {
			$('#loader').hide();
		})

	}
	$scope.getMovies();

	$scope.getMovieDetails = function(url){
		$scope.movie = '';
		if(!$scope.$$phase){
			$scope.$apply();
		}
		var data = window.btoa('http://www.imdb.com'+url);
		$('#loader').show();
		Movies.getMovieDetails(data).then(function(result) {
			$('#loader').hide();
			$scope.movie = result;
			$('#movieDetail').modal('show');
			$scope.getCastPic(result.cast)
		}).catch(function(reason) {
			$('#loader').hide();
		})
	}

	$scope.getCastPic = function(cast){
		for(var i in cast){
			var data = encodeURIComponent('http://www.imdb.com'+cast[i].link);
			Movies.getCastPic(data).then(function(result) {
				$("[data-name='"+result.name.toLowerCase()+"']").find('img').attr('src',result.pic);
			}).catch(function(reason) {
				console.log(reason)
			})
		}
		
	}


}]);
