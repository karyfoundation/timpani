"use strict";
function parse(timpaniCode) {
    return new Parser(timpaniCode).parse();
}
exports.parse = parse;
var Parser = (function () {
    function Parser(code) {
        this.code = code;
        this.length = code.length;
        this.pointer = 0;
        this.results = new Array();
        this.currentStringStack = '';
    }
    Parser.prototype.parse = function () {
        this.switchLooper();
        this.finalizeCurrentStack();
        return this.results;
    };
    Parser.prototype.getNextChar = function () {
        return this.code[this.pointer++];
    };
    Parser.prototype.finalizeCurrentStack = function () {
        if (this.currentStringStack !== '') {
            this.results.push({
                type: 'string',
                value: [this.currentStringStack]
            });
        }
        this.currentStringStack = '';
    };
    Parser.prototype.switchLooper = function () {
        var _this = this;
        this.loop(function (char) {
            switch (char) {
                case '*':
                    _this.finalizeCurrentStack();
                    _this.results.push(_this.parseOneCharSignedGrammar('*', 'bold'));
                    break;
                case '_':
                    _this.finalizeCurrentStack();
                    _this.results.push(_this.parseOneCharSignedGrammar('_', 'underline'));
                    break;
                case '~':
                    _this.finalizeCurrentStack();
                    _this.results.push(_this.parseOneCharSignedGrammar('~', 'stroke'));
                    break;
                default:
                    _this.currentStringStack += char;
                    break;
            }
        });
    };
    Parser.prototype.loop = function (f) {
        while (this.pointer < this.length) {
            var currentChar = this.getNextChar();
            var breakStatus = f(currentChar);
            if (breakStatus === 0)
                break;
        }
    };
    Parser.prototype.parseOneCharSignedGrammar = function (sign, type) {
        var token = '';
        var oneCharResult = {
            type: 'string',
            value: ['']
        };
        this.loop(function (char) {
            if (char === sign) {
                oneCharResult = {
                    type: type,
                    value: (sign === '`') ?
                        [token] : new Parser(token).parse()
                };
                return 0;
            }
            else {
                token += char;
            }
        });
        return oneCharResult;
    };
    return Parser;
}());
//# sourceMappingURL=index.js.map