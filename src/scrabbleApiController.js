var _ = require('underscore');
module.exports = function() {

    function findWordsStartingWith(word) {
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
                return groupByLength(subarry.words);
            }
        }
        return;
    }

    function findWordsEndingWith(word) {
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
                return groupByLength(subarry.words);
            }
        }
        return;
    }

    function findWordsContaining(inputLetters) {
        inputLetters = inputLetters.toLowerCase();
        var words = [];
        for(var x = 0, len =  global.scrabbleObj.words.length - 1; x <= len; x++) {
            var word = global.scrabbleObj.words[x];
            var letterCopy = inputLetters;
            for(var y = 0, iLen = word.length - 1; y <= iLen; y++) {
                if(letterCopy.indexOf(word[y]) < 0) {
                    if(letterCopy.indexOf("*") > -1) {
                        letterCopy = removeFromArray(letterCopy, "*");
                    }
                    else {
                        break;
                    }
                }
                else {
                    letterCopy = removeFromArray(letterCopy, word[y]);
                }

                if(y === iLen){
                    words.push(word);
                }
            }

        }

        return groupByLength(words);
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
        _.each(global.scrabbleObj.startsWith, function(item, name) {
            urls.push({ url: '/starts/with/'+name,  changefreq: 'daily', priority: 0.5 });
        });
        _.each(global.scrabbleObj.endsWith, function(item, name) {
            urls.push({ url: '/ends/with/'+name,  changefreq: 'daily', priority: 0.5 });
        });

        return urls;
    }

    function groupByLength(arr) {
        var toRet = {};
        _.each(arr, function(item) {
            var len = 'len'+item.length;
            var arrItem = toRet[len]
            if(!arrItem) {
                var obj = {
                    length: item.length,
                    words: []
                };
                toRet[len] = obj;
                arrItem = toRet[len]
            }
            arrItem.words.push(item);
        });

        toRet = _.sortBy(toRet, function(item) {
            return item.length;
        });
        return toRet;
    }

    return {
        findWordsStartingWith:findWordsStartingWith,
        findWordsEndingWith: findWordsEndingWith,
        findWordsContaining: findWordsContaining,
        getSiteMapUrls: getSiteMapUrls
    };
}();
