var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var apiController = require('../src/scrabbleApiController');
var wordController = require('../src/wordController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { word: '', filter:{} });
});

router.post('/search', function(req, res) {
  var searchType = req.body.searchType;
  var searchQuery = req.body.searchQuery.toLowerCase();

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

var sitemap = sm.createSitemap ({
  hostname: 'http://scrabble.ninja',
  cacheTime: 2600000,        // 600 sec - cache purge period
  urls: apiController.getSiteMapUrls()
});



router.get('/sitemap.xml', function(req, res) {
  res.set('Content-Type', 'text/xml');
  res.write('<sitemapindex xmlns="http://www.google.com/schemas/sitemap/0.84"><sitemap><loc>http://scrabble.ninja/sitemapmain.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapstart.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapend.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapdef1.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapdef2.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapdef3.xml</loc></sitemap><sitemap><loc>http://scrabble.ninja/sitemapdef4.xml</loc></sitemap></sitemapindex>')
  res.end();
});

router.get('/sitemapmain.xml', function(req, res) {
  var sitemapmain = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMapUrls()
  });
  sitemapmain.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapstart.xml', function(req, res) {
  var sitemapstart = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('start')
  });
  sitemapstart.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapend.xml', function(req, res) {
  var sitemapend = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('end')
  });
  sitemapend.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapdef1.xml', function(req, res) {
  var siteMapDef1 = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('def1')
  });
  siteMapDef1.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapdef2.xml', function(req, res) {
  var siteMapDef2 = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('def2')
  });
  siteMapDef2.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapdef3.xml', function(req, res) {
  var siteMapDef3 = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('def3')
  });
  siteMapDef3.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});

router.get('/sitemapdef4.xml', function(req, res) {
  var siteMapDef4 = sm.createSitemap ({
    hostname: 'http://scrabble.ninja',
    cacheTime: 2600000,        // 600 sec - cache purge period
    urls: apiController.getSiteMaps('def4')
  });
  siteMapDef4.toXML( function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  });
});


router.get('/words/start', function(req, res) {
  var words = apiController.getStartsWithUrls();
  res.render('wordView/metaWords', { words: words});
});

function wordDefine(req,res) {
  var word = req.params.word;
  var title = 'Definition: ' + word;
  wordController.getWordDefinition(word, function(results) {
    res.render('wordView/wordDefinition', { words: results, word: word,  meta: getMeta(word,'define'), title: title});
  });

}

router.get('/word/define/:word', function(req, res) {
  wordDefine(req,res);
});

router.get('/word/definition/:word', function(req, res) {
  wordDefine(req,res);
});

router.get('/word/synonyms/:word', function(req, res) {
  wordDefine(req,res);
});



router.get('/words/end', function(req, res) {
  var words = apiController.getEndsWithUrls();
  res.render('wordView/metaWords', { words: words});
});





function getMeta(search, prettyQuery) {
  var description = 'Find Scrabble Words that '+prettyQuery+' '+search+', words '+prettyQuery+'ing '+search+'';
  var keywords = [];
  keywords.push(search);
  keywords.push('Words that '+prettyQuery+' '+search);
  if(prettyQuery === 'start with') {
    keywords.push('Words starting with '+search);
    keywords.push('Words that start with '+search);
  }
  if(prettyQuery === 'end with') {
    keywords.push('Words ending with '+search);
    keywords.push('Words that end with '+search);
  }
  if(prettyQuery === 'define') {
    keywords.push('Word definition ' + search);
    keywords.push('definition of the word '+search);
    description = 'Find the definition of the word ' + search + ' '
  }
  return {
    description: description,
    keywords: keywords
  };
}
module.exports = router;
