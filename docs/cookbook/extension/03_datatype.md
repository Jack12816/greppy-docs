## Datatypes

### Strings

```js
console.log(
    'crazy-stuff'.toCamelCase(),             // => 'crazyStuff'
    'hello World'.capitalize(),              // => 'Hello World'
    'Hello Klaus'.decapitalize(),            // => 'hello Klaus'
    'Hello %s'.format('Ralf'),               // => 'Hello Ralf'
    'high-voltage_rock'.humanize()           // => 'High / Voltage Rock'
    'LOW_FREQUENCY'.toLowerCase().humanize() // => 'Low Frequency'
);

console.log(
    'Lorem ipsum dolor sit amet, consetetur sadipscing'.words(3)
);
// => 'Lorem ipsum dolor ..'

console.log(
    'Lorem ipsum dolor sit amet, consetetur'.remove('sit ', ' amet')
);
// => 'Lorem ipsum dolor, consetetur sadipscing'

console.log(
    'test=1&array=[1,2,3]&string="abc"'.urlencode()
);
// => 'test%3D1%26array%3D%5B1%2C2%2C3%5D%26string%3D%22abc%22'

console.log(
    'test%3D1%26array%3D%5B1%2C2%2C3%5D%26string%3D%22abc%22'.urldecode()
);
// => 'test=1&array=[1,2,3]&string="abc"'
```

### Numbers

```js
console.log(
    Number(215465121.54541).format(),           // => '215,465,122'
    Number(215465121.54541).format(2),          // => '215,465,122.55'
    Number(215465121.54541).format(4, ',', '.') // => '215.465.121,5454'
);

console.log(
    Number(215465121.54541).humanize(), // => '215.5M'
    Number(2154651.51).humanize(),      // => '2.2M'
    Number(21551.51).humanize(),        // => '21.6k'
    Number(1851.51).humanize()          // => '1.9k'
);

console.log(
    Number(0).memory(),                // => '0.00 B'
    Number(1000).memory(),             // => '1000.00 B'
    Number(1024).memory(),             // => '1.00 KB'
    Number(827298759).memory(),        // => '788.97 MB'
    Number(272982234759).memory(),     // => '254.23 GB'
    Number(8272982234759).memory(),    // => '7.52 TB'
    Number(5678272582234759).memory(), // => '5.04 PB'
);
```

### Arrays

```js
console.log(
    Array.uniq([77, 77, 3, 45, 3, 54, 7])
);
// => [ 3, 7, 45, 54, 77 ]

console.log(
    Array.toObject([77, 77, 3, 45, 3, 54, 7])
);
// {
//     "0": 77,
//     "1": 77,
//     "2": 3,
//     "3": 45,
//     "4": 3,
//     "5": 54,
//     "6": 7
// }

console.log(
    Array.toObject(
        ['one', 'two', 'three', 'four', 'five'],
        [77, 77, 3, 45, 3]
    )
);
// {
//     "one": 77,
//     "two": 77,
//     "three": 3,
//     "four": 45,
//     "five": 3
// }
```

