
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

    export type TTokenType = 'string' | 'bold' | 'underline' | 'code'

    export interface IToken {
        type: TTokenType
        value: ( IToken | string )[ ]
    }

//
// ─── ENTRY POINT ────────────────────────────────────────────────────────────────
//

    export function parse ( timpaniCode: string ) {
        return new Parser( timpaniCode ).parse( )
    }

//
// ─── PARSER CORE ────────────────────────────────────────────────────────────────
//

    class Parser {

        //
        // ─── STORAGE ─────────────────────────────────────────────────────
        //

            // info
            code: string
            pointer: number
            length: number

            results: IToken[ ]

            currentStringStack: string

        //
        // ─── INIT ────────────────────────────────────────────────────────
        //

            constructor ( code: string ) {
                this.code = code
                this.length = code.length
                this.pointer = 0

                this.results = new Array<IToken>( )
                this.currentStringStack = ''
            }

        //
        // ─── PARSE ───────────────────────────────────────────────────────
        //

            public parse ( ) {
                this.switchLooper( )
                this.finalizeCurrentStack( )
                return this.results
            }

        //
        // ─── GET NEXT CHAR ───────────────────────────────────────────────
        //

            private getNextChar ( ) {
                return this.code[ this.pointer++ ]
            }

        //
        // ─── FINALIZE CURRENT STACK ──────────────────────────────────────
        //

            private finalizeCurrentStack ( ) {
                if ( this.currentStringStack !== '' ) {
                    this.results.push({
                        type: 'string',
                        value: [ this.currentStringStack ]
                    })
                }
                this.currentStringStack = ''
            }

        //
        // ─── SWITCH LOOPER ───────────────────────────────────────────────
        //

            private switchLooper ( ) {
                this.loop( char => {
                    switch ( char ) {
                        case '*':
                            this.finalizeCurrentStack( )
                            this.results.push( this.parseOneCharSignedGrammar( '*', 'bold' ) )
                            break

                        case '_':
                            this.finalizeCurrentStack( )
                            this.results.push( this.parseOneCharSignedGrammar( '_', 'underline' ) )
                            break

                        case '`':
                            this.finalizeCurrentStack( )
                            this.results.push( this.parseOneCharSignedGrammar( '`', 'code' ) )
                            break

                        default:
                            this.currentStringStack += char
                            break
                    }
                })
            }

        //
        // ─── LOOP ────────────────────────────────────────────────────────
        //

            private loop ( f: ( char: string ) => void | number ) {
                while ( this.pointer < this.length ) {
                    const currentChar = this.getNextChar( )
                    const breakStatus = f( currentChar )

                    if ( breakStatus === 0 )
                        break
                }
            }

        //
        // ─── ONE STRING SIGNED GRAMMAR ───────────────────────────────────
        //

            private parseOneCharSignedGrammar ( sign: string, type: TTokenType ): IToken {
                let token = ''
                let oneCharResult: IToken = {
                    // just a dummy
                    type: 'string',
                    value: [ '' ]
                }

                this.loop( char => {
                    if ( char === sign ) {
                        oneCharResult = {
                            type: type,
                            value: ( sign === '`' )?
                                [ token ] : new Parser( token ).parse( )
                        }                 
                        return 0

                    } else {
                        token += char
                    }
                })

                return oneCharResult
            } 
            
        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────

