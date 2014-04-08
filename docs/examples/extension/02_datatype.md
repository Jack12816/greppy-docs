## Datatypes

### Show some extensions on some native objects

```javascript
console.log(
    [77, 3, 45, 54, 7].uniq(),
    'crazy-shit'.toCamelCase(),
    'hello World'.capitalize()
);

// [ 3, 7, 45, 54, 77 ]
// 'crazyShit'
// 'Hello World'

'Hello %s'.format('Ralf') // => 'Hello Ralf'
```

