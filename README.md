# Timpani
A very small markup language for inline styling supporting:
- Bold using: `*bold*`
- Underlined: `_underlined_`
- Stroked: `~stroke~`

## Install
```
npm install --save timpani
```

## How to use
```js
import * as timpani from 'timpani'

const ast = timpani.parse('hello *world*')
```