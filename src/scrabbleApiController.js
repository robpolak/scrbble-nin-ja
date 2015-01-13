var _ = require('underscore');
module.exports = function() {

    function findWordsStartingWith(word, filter) {
        var prefix = '';
        if (word.length == 1)
            prefix = word;
        else if (word.length == 2)
            prefix = word.substr(0, 2);
        else
            prefix = word.substr(0, 3);

        var arr = global.scrabbleObj.startsWith[prefix];
        if (arr) {
            var subarry = arr[word];
            if (subarry) {
                return groupByLength(subarry.words, filter);
            }
        }
        return;
    }

    function findWordsEndingWith(word, filter) {
        var prefix = '';
        if (word.length == 1)
            prefix = word;
        else if (word.length == 2)
            prefix = word.substr(0, 2);
        else
            prefix = word.substr(0, 3);

        var arr = global.scrabbleObj.endsWith[prefix];
        if (arr) {
            var subarry = arr[word];
            if (subarry) {
                return groupByLength(subarry.words, filter);
            }
        }
        return;
    }

    function findWordsContaining(inputLetters, filter) {
        inputLetters = inputLetters.toLowerCase();
        var words = [];
        for (var x = 0, len = global.scrabbleObj.words.length - 1; x <= len; x++) {
            var word = global.scrabbleObj.words[x];
            var letterCopy = inputLetters;
            for (var y = 0, iLen = word.length - 1; y <= iLen; y++) {
                if (letterCopy.indexOf(word[y]) < 0) {
                    if (letterCopy.indexOf("*") > -1) {
                        letterCopy = removeFromArray(letterCopy, "*");
                    }
                    else {
                        break;
                    }
                }
                else {
                    letterCopy = removeFromArray(letterCopy, word[y]);
                }

                if (y === iLen) {
                    words.push(word);
                }
            }

        }

        return groupByLength(words, filter);
    }

    function removeFromArray(arr, letter) {
        var str = '';
        var found = false;
        for (var x = 0, len = arr.length; x < len; x++) {
            if (!found && arr[x] === letter) {
                found = true;
                continue;
            }
            str = str + arr[x];
        }
        return str;
    }

    function getSiteMapUrls() {
        var urls = [];
        urls.push({url: '/', changefreq: 'daily', priority: 1});
        urls.push({url: '/words/start', changefreq: 'daily', priority: 1});
        urls.push({url: '/words/end', changefreq: 'daily', priority: 1});

        _.each(global.scrabbleObj.startsWith, function (item, name) {
            urls.push({url: '/words/starting/with/' + name, changefreq: 'daily', priority: 0.5});
        });
        _.each(global.scrabbleObj.endsWith, function (item, name) {
            urls.push({url: '/words/ending/with/' + name, changefreq: 'daily', priority: 0.5});
        });

        return urls;
    }

    function getStartsWithUrls() {
        var urls = [];
        _.each(global.scrabbleObj.startsWith, function (item, name) {
            urls.push({url: '/words/starting/with/' + name, word:name});
        });

        return urls;
    }


    function getEndsWithUrls() {
        var urls = [];
        _.each(global.scrabbleObj.endsWith, function (item, name) {
            urls.push({url: '/words/ending/with/' + name, word:name});
        });

        return urls;
    }

var scrabbleValues = {
  A : 1,
  B : 3,
  C : 3,
  D : 2,
  E : 1,
  F : 4,
  G : 2,
  H : 4,
  I : 1,
  J : 8,
  K : 5,
  L : 1,
  M : 3,
  N : 1,
  O : 1,
  P : 3,
  Q : 10,
  R : 1,
  S : 1,
  T : 1,
  U : 1,
  V : 4,
  W : 4,
  X : 8,
  Y : 4,
  Z : 10
  };
  var wordsWithFriendsValues = {
    A : 1,
    B : 4,
    C : 4,
    D : 2,
    E : 1,
    F : 4,
    G : 3,
    H : 3,
    I : 1,
    J : 10,
    K : 5,
    L : 2,
    M : 4,
    N : 2,
    O : 1,
    P : 4,
    Q : 10,
    R : 1,
    S : 1,
    T : 1,
    U : 2,
    V : 5,
    W : 4,
    X : 8,
    Y : 3,
    Z : 10
  };
  
    function getScores(word) {
      var toRet = {
        scrabbleScore: 0,
        wwfScore: 0
      };
      _.each(word, function(letter) {
        toRet.scrabbleScore = toRet.scrabbleScore + scrabbleValues[letter.toUpperCase()];
        toRet.wwfScore = toRet.wwfScore + wordsWithFriendsValues[letter.toUpperCase()];
      });
      return toRet;
    }

    function getBestScoringWords() {

    }

    function groupByLength(arr, filter) {
        var toRet = {};
        _.each(arr, function (item) {
            var len = 'len' + item.length;
            var arrItem = toRet[len]
            if (!arrItem) {
                var obj = {
                    length: item.length,
                    words: []
                };
                toRet[len] = obj;
                arrItem = toRet[len]
            }
            var score = getScores(item);
            var word = {
              word: item,
              score: score
            }
            if(passesFilter(word, filter)) {
                arrItem.words.push(word);
            }
        });
        _.each(toRet, function(grp, index) {
            if (grp.words.length > 0) {
                grp.words = _.sortBy(grp.words, function (grpItem) {
                    return -grpItem.score.wwfScore;
                });
            }
            else {
                delete toRet[index];
            }
        });

        toRet = _.sortBy(toRet, function (item) {
            return -item.length;
        });
        return toRet;
    }

    function passesFilter(item, filter) {
        var toRet = true;
        var word = item.word;
        if(filter.startsWith) {
            if(word.indexOf(filter.startsWith) != 0) {
                toRet = false;
            }
        }
        if(filter.endsWith) {
            var expectedPos = word.length - filter.endsWith.length;
            if(word.indexOf(filter.endsWith) != expectedPos || expectedPos < 0) {
                toRet = false;
            }
        }
        if(filter.minScore) {
            if(item.score.wwfScore < filter.minScore && item.score.scrabbleScore < filter.minScore)
            {
                toRet = false;
            }
        }
        if(filter.contains) {
            if(word.indexOf(filter.contains) < 0) {
                toRet = false;
            }
        }
        return toRet;
    }

    return {
        findWordsStartingWith: findWordsStartingWith,
        findWordsEndingWith: findWordsEndingWith,
        findWordsContaining: findWordsContaining,
        getSiteMapUrls: getSiteMapUrls,
        getStartsWithUrls:getStartsWithUrls,
        getEndsWithUrls: getEndsWithUrls
    };
}();
