
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

    interface I {
        code: string
        pointer: number
        length: number
    }

    export type TTokenType = 'string' | 'bold' | 'underline'

    export interface IToken {
        type: TTokenType
        value: IToken[ ] | string
    }

//
// ─── ENTRY POINT ────────────────────────────────────────────────────────────────
//

    export function parse ( inlineMarkdown: string ) {
        return parseWithI({
            code: inlineMarkdown,
            length: inlineMarkdown.length,
            pointer: 0
        })
    }

//
// ─── GET CURRENT CHAR ───────────────────────────────────────────────────────────
//

    function getCurrentChar ( code: I, stack: string ) {
        let char = code.code[ code.pointer ]
        stack += char
        return char
    }

// ─── LOOPER ─────────────────────────────────────────────────────────────────────
//

    function loop ( code: I, f: ( char: string ) => void ) {
        let currentStack = ''
        let results: IToken[ ] = [ ]
        while ( code.pointer < code.length ) {
            const currentChar = getCurrentChar( code, currentStack )
            code.pointer++

            f( currentChar )

            // safety check
            if ( code.pointer > code.length ) {
                return {
                    type: 'string',
                    value: currentStack
                }
            }
        }
    }

//
// ─── PARSER LOOP ────────────────────────────────────────────────────────────────
//

    function parseWithI ( code: I ) {

        //
        // ─── VARS ────────────────────────────────────────────────────────
        //

            let results = new Array<IToken>( )
            let currentStringStack = ''

        //
        // ─── SUPPORTING FUNCS ────────────────────────────────────────────
        //

            function finishCurrentStack ( ) {
                if ( currentStringStack.length !== 0 ) {
                    results.push({
                        type: 'string',
                        value: currentStringStack
                    })
                    currentStringStack = ''
                }
            }

        //
        // ─── THE LOOP ────────────────────────────────────────────────────
        //

            loop( code, char => {
                switch ( char ) {
                    case '*':
                        finishCurrentStack( )
                        results.push( parseOneCharSignedGrammar( code, '*', 'bold' ) )
                        break

                    case '_':
                        finishCurrentStack( )
                        results.push( parseOneCharSignedGrammar( code, '_', 'underline' ) )
                        break

                    default:
                        currentStringStack += char
                }
            })

            finishCurrentStack( )

            return results

        // ─────────────────────────────────────────────────────────────────

    }

//
// ─── PARSE BOLD ─────────────────────────────────────────────────────────────────
//

    function parseOneCharSignedGrammar ( code: I, sign: string, type: TTokenType ): IToken {
        let token = ''
        let result: IToken = { type: 'string', value: '' } // just a dummy

        loop( code, char => {
            if ( char === sign ) {
                code.pointer++
                result = {
                    type: type,
                    value: parseWithI({
                        pointer: 0,
                        code: token,
                        length: token.length
                    })
                }                 
                return
            } else {
                token += char
            }
        })

        return result
    } 

// ────────────────────────────────────────────────────────────────────────────────
