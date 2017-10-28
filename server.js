/**
 * code created by indrajeet ambadekar
 */

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var app     = express();
app.use(cors());

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});
app.get('/movies', function(req, res){
  url = 'http://www.imdb.com/chart/top';
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var movies = [];

      $('.lister-list tr').filter(function(){
        movies.push({
          title : $(this).find('.titleColumn').find('a').text().trim(),
          link : $(this).find('.titleColumn').find('a').attr('href'),
          year : $(this).find('.titleColumn').find('.secondaryInfo').text().replace(/[^\w\s]/gi, ''),
          pic : $(this).find('.posterColumn').find('img').attr('src'),
          rating : $(this).find('.imdbRating').text().trim(),
        })
      })
    }
    var list={
      'movies' : movies
    }

    fs.writeFile('list.json', JSON.stringify(list, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send(list);
    return JSON.stringify(list);
  })
}).get('/details/:link', function(req, res){
  url = new Buffer(req.params.link, 'base64').toString();
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var movieData = {};
      movieData.name = $('.title_wrapper').find('h1').text().trim();
      movieData.url = url;
      movieData.info = {
        'movieRating':$('.title_wrapper').find('.subtext').children('[itemprop="contentRating"]').attr('content'),
        'duration':$('.title_wrapper').find('.subtext').children('[itemprop="duration"]').text().trim(),
        'released':$('.title_wrapper').find('[itemprop="datePublished"]').closest('a').text().trim()
      };
      movieData.rating = $('.ratingValue').find('strong').children('span').text().trim();
      movieData.reviewer_count = $('.imdbRating').find('.small').text().trim();
      movieData.poster=$('.poster').find('img').first().attr('src');
      movieData.info.genre=[];
      $('.title_wrapper').find('.subtext').find('[itemprop="genre"]').filter(function(){
        movieData.info.genre.push($(this).text().trim())
      })
      movieData.description = $('[itemprop="description"]').find('p').text().trim();
      movieData.reviews=[];
      $('.titleReviewBarItem.titleReviewbarItemBorder').find('a').each(function(){
        movieData.reviews.push($(this).text())  
      })
      movieData.director = []
      $("[itemprop='director']").filter(function(){
        movieData.director.push({
          'name':$(this).find('a').text().trim(),
          'link':$(this).find('a').attr('href'),
        })        
      });
      movieData.writer = [];
      $('.plot_summary ').find("[itemprop='creator']").filter(function(){
        movieData.writer.push({
          'name':$(this).find('a').text().trim(),
          'link':$(this).find('a').attr('href')
        });
      });
      movieData.cast = [];
      $('.cast_list').find('tr.odd,tr.even').filter(function(){
        movieData.cast.push({
          'pic':$(this).find('.primary_photo').find('img.loadlate').attr('src'),
          'name':$(this).find(".itemprop").find('.itemprop').first().text().trim(),
          'link':$(this).find(".itemprop").find('a').attr('href')
        });
      });
      fs.writeFile('movie.json', JSON.stringify(movieData, null, 4), function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      })

      console.log(movieData.cast)

      res.send(movieData);
    }

  })
}).get('/moviesCast/:hash', function(req, res){
  url = 'http://www.imdb.com/chart/top';
  console.log(req.params.hash)
  request(req.params.hash, function(error, response, html){
    var cast={}
    if(!error){
      var $ = cheerio.load(html);
      cast.pic = $('#img_primary').find('img').attr('src')
      cast.name = $('#overview-top').find('h1').find('.itemprop').text().trim();

    }


    res.send(cast);
  })
})


app.listen('8081')

console.log('Server running at 8180');
exports = module.exports = app;
