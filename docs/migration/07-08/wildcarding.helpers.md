## Wildcard loading of helpers

Greppy 0.8 supports real wildcard loading of helpers. With support for inner
and end of path wildcards and globstars. The new implementation supersedes the
poor implementation of 0.7 where we only support wildcarding on the end of a
path which acts more like the new globstars. With the help of this new feature
you will be able to skip big and complicated manual walking through results of
``greppy.helper.list()`` to filter helpers equivalently.

### The 0.7 code base

```js
var map = greppy.helper.get('renderer.meta.*');
// {
//     "author": {},
//     "description": {},
//     "expires": {},
//     "robots": {},
//     "provider.google.robots": {},
//     "provider.google.site-verification": {},
//     "provider.bing.robots": {},
//     "provider.google.site-verification": {}
// }

// Not supported in 0.7
var map = greppy.helper.get('renderer.meta.**');
var map = greppy.helper.get('renderer.meta.provider.*.robots');
var map = greppy.helper.get('renderer.**.google.*');
var map = greppy.helper.get('renderer.**.google.site-verification');
```

### The 0.8 code base

* A wildcard (\*) will match all helpers on the first level
* Globstars (\*\*) will match all helpers on any level
* The result will be a flat or deep hash
* We strip the prefix of the paths until we reach the first asterisk

```js
var map = greppy.helper.get('renderer.meta.*');
// {
//     "author": {},
//     "description": {},
//     "expires": {},
//     "robots": {}
// }

var map = greppy.helper.get('renderer.meta.**');
// {
//     "author": {},
//     "description": {},
//     "expires": {},
//     "robots": {},
//     "provider": {
//         "google": {
//             "robots": {},
//             "site-verification": {}
//         },
//         "bing": {
//             "robots": {},
//             "site-verification": {}
//         }
//     }
// }

var map = greppy.helper.get('renderer.meta.provider.*.robots');
// {
//     "google": {
//         "robots": {}
//     },
//     "bing": {
//         "robots": {}
//     }
// }

var map = greppy.helper.get('renderer.**.google.*');
// {
//     "meta": {
//         "provider": {
//             "google": {
//                 "robots": {},
//                 "site-verification": {}
//             }
//         }
//     }
// }

var map = greppy.helper.get('renderer.**.google.site-verification');
// {
//     "meta": {
//         "provider": {
//             "google": {
//                 "site-verification": {}
//             }
//         }
//     }
// }
```

