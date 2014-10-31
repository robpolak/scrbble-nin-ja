var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var apiController = require('../src/scrabbleApiController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/starts/with/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: 'Express'});
    return;
  }
  var result = apiController.findWordsStartingWith(word);
  var words = [];
  if(result) {
    words = result;
  }
  else {
    res.render('index', {title: 'Express'});
    return;
  }
  res.render('startsWith/index', { word: word, results: words});
});

router.get('/ends/with/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: 'Express'});
    return;
  }
  var result = apiController.findWordsEndingWith(word);
  var words = [];
  if(result) {
    words = filterBasedOnQuery(req.query,result);
  }
  else {
    res.render('index', {title: 'Express'});
    return;
  }
  res.render('endswith/index', { word: word, results: words});
});

router.get('/contains/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: 'Express'});
    return;
  }
  var result = apiController.findWordsContaining(word);
  var words = [];
  if(result) {
    words = filterBasedOnQuery(req.query,result);
  }
  else {
    res.render('index', {title: 'Express'});
    return;
  }
  res.render('contains/index', { word: word, results: words});
});

var sitemap = sm.createSitemap ({
  hostname: 'http://scrabble.ninja',
  cacheTime: 1600000,        // 600 sec - cache purge period
  urls: apiController.getSiteMapUrls()
});

router.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

function filterBasedOnQuery(query,data) {
  var toRet = data;

  if(query.contains) {
      var arr;

  }

  return toRet;
}


module.exports = router;
