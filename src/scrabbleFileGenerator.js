var fileController = require('./fileController');
var _ = require('underscore');

var ScrabbleFile = function() {

}
var wordMatrix = {
    startsWith: {},
    endsWith: {},
    words: []
};

function parsefile() {
    _.each(wordMatrix.words, function(word) {
        //parseWordIntoMatrix(word);
        addXWiths(word);
    });
    saveFile();
}

function saveFile() {
    fileController.writeAndCompressFile(JSON.stringify(wordMatrix), 'cachedScrabble.js');
}

function matrixWord(matrix, word) {
    var len = word.length;
    var prop = len+'d';
    if(!matrix[prop])
        matrix[prop]  =[];
    if(!_.contains(matrix[prop], word)) {
        matrix[prop].push(word);
    }
}

function updateXwith(arr, word, mainWord, endWord) {
    var subObj = '';
    if(word.length == 1) {
        subObj = word;
    }
    else if(word.length == 2) {
        if(endWord){
            subObj = word.substr(word.length - 2, word.length);
        }
        else {
            subObj = word.substr(0, 2);
        }
    }
    else {
        if(endWord){
            subObj = word.substr(word.length - 3, word.length);
        }
        else {
            subObj = word.substr(0, 3);
        }
    }

    var subArr = arr[subObj];

    if(!subArr) {
        arr[subObj] = {};
        subArr = arr[subObj];
    }

    if(subArr[word]) {
        if(!subArr[word].words)
        {

        }
        else {
            subArr[word].words.push(mainWord);
        }
        return;
    }

    var obj = {
        words: []
    };

    obj.words.push(mainWord);
    subArr[word] = obj;
}

function addXWiths(word) {
    var len = word.length;
    var startsWith = '';
    var endsWith = '';
    for(var x = 0;x < len; x++) {
        var stLet = word[x];
        var endLet = word[word.length - x - 1];
        startsWith = startsWith + stLet;
        endsWith = endLet + endsWith;
        updateXwith(wordMatrix.startsWith, startsWith, word, false);
        updateXwith(wordMatrix.endsWith, endsWith, word, true);
    }
}

function parseWordIntoMatrix(word) {
    var matrix = {

    };
    var soFar = '';
    _.each(word,function(letter) {
        soFar = soFar + letter;
        matrixWord(matrix, soFar);
        matrixWord(matrix, letter);
        var y = '';
        for(var i = soFar.length - 1; i > 0; i--) {
            var o = soFar[i];
            y = o + y;
            matrixWord(matrix, o);
            matrixWord(matrix, y);
        }
    });
}

ScrabbleFile.prototype.loadFile = function(fileName) {
    fileController.loadFileIntoArray(fileName, function(data) {
        wordMatrix.words = data;
        parsefile();
    })
};

module.exports = new ScrabbleFile();
//robert