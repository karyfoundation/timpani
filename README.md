# Timpani
A very small markup language for inline styling supporting:
- Bold using: `*bold*`
- Underlined: `_underlined_`

## How to use
```
import * as timpani from 'timpani'

const ast = timpani.parse('hello *world*')
```