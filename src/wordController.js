var WNdb = require('WNdb');
var natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    wordnet = new natural.WordNet();;


module.exports = function(){

    function getWordDefinition(word, cb) {
        word = word.toLowerCase();
        wordnet.lookup(word, function(results) {
            if(cb && typeof cb === 'function') {
                cb(results);
            }
        });
    }

    return{
        getWordDefinition: getWordDefinition
    };
}();
