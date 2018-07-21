# eslint-plugins-esayemm

```
yarn add eslint-plugins-esayemm --dev
```

## Usage

In `.eslintrc`

```json
{
	"plugins": ["esayemm"],
	"rules": {
		"esayemm/align-imports": 2,
		"esayemm/sort-imports": 2
	}
}
```

## Rules

#### `esayemm/align-imports`

Fixable

Invalid

```js
import a from 'a'
import foo from 'foo'
```

Valid

```js
import a   from 'a'
import foo from 'foo'
```

#### `esayemm/sort-imports`

Fixable

Invalid

```js
import b from 'b'
import a from 'a'
```

Valid

```js
import a from 'a'
import b from 'b'
```

## Development

Run `make` to see the development API.

## Links

- [astexplorer](http://astexplorer.net/)
- [eslint nodejs api](https://eslint.org/docs/developer-guide/nodejs-api)
- [eslint working with rules](https://eslint.org/docs/developer-guide/working-with-rules)
