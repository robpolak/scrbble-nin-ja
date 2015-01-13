var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var apiController = require('../src/scrabbleApiController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { word: '', filter:{} });
});

router.post('/search', function(req, res) {
  var searchType = req.body.searchType;
  var searchQuery = req.body.searchQuery;

  var params = [];

  if(req.body.advStartsWith) {
    params.push('startsWith='+req.body.advStartsWith);
  }
  if(req.body.advEndsWith){
    params.push('endsWith='+req.body.advEndsWith);
  }
  if(req.body.advContains){
    params.push('contains='+req.body.advContains);
  }
  if(req.body.advMinScore)
  {
    params.push('minScore='+req.body.advMinScore);
  }

  var queryString = '';
  if(params.length > 0) {
    queryString = '?' + params.join('&');
  }

  if(searchType === 'contains')
    res.redirect('/contains/'+ searchQuery + queryString);
  else if(searchType === 'startswith')
    res.redirect('/words/starting/with/'+ searchQuery + queryString);
  else if(searchType === 'endswith')
    res.redirect('/words/ending/with/'+ searchQuery  + queryString);
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

function getFilter(req) {
  var filter = {};
  if(req.query.startsWith) {
    filter.startsWith =req.query.startsWith;
  }
  if(req.query.endsWith) {
    filter.endsWith =req.query.endsWith;
  }
  if(req.query.contains) {
    filter.contains =req.query.contains;
  }
  if(req.query.minScore) {
    filter.minScore =req.query.minScore;
  }
  return filter;
}

function startsWith(req,res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: ''});
    return;
  }
  var result = apiController.findWordsStartingWith(word, getFilter(req));

  var prettyQuery = 'start with';
  var title = 'Words Starting with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: result, title: title, prettyQuery:prettyQuery, meta: getMeta(word,prettyQuery), filter: getFilter(req)});
}

function endsWith(req,res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: 'Express'});
    return;
  }

  var result = apiController.findWordsEndingWith(word, getFilter(req));
  var prettyQuery = 'ends with';
  var title = 'Words Ending with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: result, title: title, prettyQuery:'end with', meta: getMeta(word,prettyQuery), filter: getFilter(req)});
}

router.get('/contains/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {title: 'Express'});
    return;
  }
  var result = apiController.findWordsContaining(word, getFilter(req));

  var prettyQuery = 'contains';
  var title = 'Words Starting with the Letters: ' + word + '';
  res.render('wordView/wordView', { word: word, results: result, title: title, prettyQuery:'contains', meta: getMeta(word,prettyQuery), filter: getFilter(req)});
});

function getFilters(req,res) {
  var filterObj = {};
  if(req.query.startsWith) {
    filterObj.push()
  }
}

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
