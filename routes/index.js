var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var apiController = require('../src/scrabbleApiController');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { word:''  });
});

router.post('/search', function(req, res) {
  var searchType = req.body.searchType;
  var searchQuery = req.body.searchQuery;
  var qs = {};
  if(req.body.advContains) {
    qs['contains'] = req.body.advContains;
  }
  if(req.body.advStartsWith) {
    qs['startsWith'] = req.body.advStartsWith;
  }
  if(req.body.advEndsWith) {
    qs['endsWith'] = req.body.advEndsWith;
  }
  if(req.body.advMinScore) {
    qs['minScore'] = req.body.advMinScore;
  }
  var encodedQs = encodeQueryData(qs);
  if(encodedQs.length > 0) {
    encodedQs = '?' + encodedQs;
  }
  if(searchType === 'contains')
    res.redirect('/contains/'+ searchQuery + encodedQs);
  else if(searchType === 'startswith')
    res.redirect('/starts/with/'+ searchQuery + encodedQs);
  else if(searchType === 'endswith')
    res.redirect('/ends/with/'+ searchQuery + encodedQs);
  return;
});

router.get('/starts/with/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {});
    return;
  }
  var result = apiController.findWordsStartingWith(word);
  var words = [];
  if(result) {
    words = filterBasedOnQuery(req.query,result);
  }
  else {
    res.render('index', {});
    return;
  }
  var title = 'Words Starting with the Letters: "' + word + '"';
  res.render('wordView/wordView', {
    word: word, results: words,
    title: title,
    startsWith: req.query.startsWith || '',
    endsWith: req.query.endsWith || '',
    minScore: req.query.minScore || '',
    contains: req.query.contains || ''
  });
});

router.get('/ends/with/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {});
    return;
  }
  var result = apiController.findWordsEndingWith(word);
  var words = [];
  if(result) {
    words = filterBasedOnQuery(req.query,result);
  }
  else {
    res.render('index', {});
    return;
  }
  var title = 'Find Scrabble words ending with the Letters: "' + word + '"';
  res.render('wordView/wordView', {
    word: word, results: words,
    title: title,
    startsWith: req.query.startsWith || '',
    endsWith: req.query.endsWith || '',
    minScore: req.query.minScore || '',
    contains: req.query.contains || ''
  });
});

router.get('/contains/:word', function(req, res) {
  var word = req.params.word
  if(!word) {
    res.render('index', {});
    return;
  }
  var result = apiController.findWordsContaining(word);
  var words = [];
  if(result) {
    words = filterBasedOnQuery(req.query,result);
  }
  else {
    res.render('index', {});
    return;
  }

  var title = 'Find scrabble that contains the letters: "' + word + '"';

  res.render('wordView/wordView', {
    word: word, results: words,
    title: title,
    startsWith: req.query.startsWith || '',
    endsWith: req.query.endsWith || '',
    minScore: req.query.minScore || '',
    contains: req.query.contains || ''
  });
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

function filterBasedOnQuery(queryString,data) {
  var toRet = data;
  _.each(toRet, function(letterGroup,y) {
    _.each(letterGroup.words, function(wordObj, i) {

      if(wordObj && wordObj.word) {


        if (queryString.contains) {
          if (wordObj.word.indexOf(queryString.contains) < 0) {
            toRet[y].words.splice(i);
          }
        }
        if (queryString.endsWith) {
          if (!wordObj.word.endsWith(queryString.endsWith)) {
            toRet[y].words.splice(i);
          }
        }
        if (queryString.startsWith) {
          if (!wordObj.word.startsWith(queryString.startsWith)) {
            toRet[y].words.splice(i);
          }
        }
        if (queryString.minScore) {
          if (wordObj.score.scrabbleScore < queryString.minScore && wordObj.score.wwfScore < queryString.minScore) {
            toRet[y].words.splice(i);
          }
        }
      }
    });
  });
  _.each(toRet, function(letterGroup, i) {
    if(!letterGroup || !letterGroup.words || letterGroup.words.length === 0) {
      toRet.splice(i);
    }
  });

  return toRet;
}

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};

function encodeQueryData(data)
{
  var ret = [];
  for (var d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}


module.exports = router;
