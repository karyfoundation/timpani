"use strict";
function parse(inlineMarkdown) {
    return parseWithI({
        code: inlineMarkdown,
        length: inlineMarkdown.length,
        pointer: 0
    });
}
exports.parse = parse;
function getNextChar(code, stack) {
    var char = code.code[code.pointer++];
    stack += char;
    return char;
}
function loop(code, f) {
    var currentStack = '';
    var results = [];
    while (code.pointer < code.length) {
        var currentChar = getNextChar(code, currentStack);
        f(currentChar);
    }
}
function parseWithI(code) {
    var results = new Array();
    var currentStringStack = '';
    function finishCurrentStack() {
        if (currentStringStack.length !== 0) {
            results.push({
                type: 'string',
                value: [currentStringStack]
            });
            currentStringStack = '';
        }
    }
    loop(code, function (char) {
        switch (char) {
            case '*':
                finishCurrentStack();
                results.push(parseOneCharSignedGrammar(code, '*', 'bold'));
                break;
            case '_':
                finishCurrentStack();
                results.push(parseOneCharSignedGrammar(code, '_', 'underline'));
                break;
            default:
                currentStringStack += char;
        }
    });
    finishCurrentStack();
    return results;
}
function parseOneCharSignedGrammar(code, sign, type) {
    var token = '';
    var result = { type: 'string', value: [''] };
    loop(code, function (char) {
        if (char === sign) {
            code.pointer++;
            result = {
                type: type,
                value: parseWithI({
                    pointer: 0,
                    code: token,
                    length: token.length
                })
            };
            return;
        }
        else {
            token += char;
        }
    });
    return result;
}
//# sourceMappingURL=index.js.map