var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var apiController = require('../src/scrabbleApiController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { word: '' });
});

router.post('/search', function(req, res) {
  var searchType = req.body.searchType;
  var searchQuery = req.body.searchQuery;
  if(searchType === 'contains')
    res.redirect('/contains/'+ searchQuery);
  else if(searchType === 'startswith')
    res.redirect('/words/starting/with/'+ searchQuery);
  else if(searchType === 'endswith')
    res.redirect('/words/ending/with/'+ searchQuery);
  return;
});

router.get('/starts/with/:word', function(req, res) {
 return startsWith(req,res);
});
router.get('/words/starting/with/:word', function(req, res) {
  return startsWith(req,res);
});
router.get('/words/starts/with/:word', function(req, res) {
  return startsWith(req,res);
});


router.get('/ends/with/:word', function(req, res) {
  return endsWith(req,res);
});
router.get('/words/ending/with/:word', function(req, res) {
  return endsWith(req,res);
});
router.get('/words/ends/with/:word', function(req, res) {
  return endsWith(req,res);
});

function startsWith(req,res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: ''});
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
  var prettyQuery = 'start with';
  var title = 'Words Starting with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: words, title: title, prettyQuery:prettyQuery, meta: getMeta(word,prettyQuery)});
}

function endsWith(req,res) {
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
  var prettyQuery = 'ends with';
  var title = 'Words Ending with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: words, title: title, prettyQuery:'end with', meta: getMeta(word,prettyQuery)});
}

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
  var prettyQuery = 'contains';
  var title = 'Words Starting with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: words, title: title, prettyQuery:'contains', meta: getMeta(word,prettyQuery)});
});

var sitemap = sm.createSitemap ({
  hostname: 'http://scrabble.ninja',
  cacheTime: 2600000,        // 600 sec - cache purge period
  urls: apiController.getSiteMapUrls()
});

router.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/words/start', function(req, res) {
  var words = apiController.getStartsWithUrls();
  res.render('wordView/metaWords', { words: words});
});

router.get('/words/end', function(req, res) {
  var words = apiController.getEndsWithUrls();
  res.render('wordView/metaWords', { words: words});
});



function filterBasedOnQuery(query,data) {
  var toRet = data;

  if(query.contains) {
      var arr;

  }

  return toRet;
}

function getMeta(search, prettyQuery) {
  description = 'Find Scrabble Words that '+prettyQuery+' '+search+', words '+prettyQuery+'ing '+search+'';
  var keywords = [];
  keywords.push(search);
  keywords.push('Words that '+prettyQuery+' '+search);
  if(prettyQuery === 'start with') {
    keywords.push('Words starting with '+search);
  }
  if(prettyQuery === 'end with') {
    keywords.push('Words ending with '+search);
  }
  return {
    description: description,
    keywords: keywords
  };
}
module.exports = router;
