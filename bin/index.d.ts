export declare type TTokenType = 'string' | 'bold' | 'italic';
export interface IToken {
    type: TTokenType;
    value: IToken[] | string;
}
export declare function parse(inlineMarkdown: string): IToken[];
