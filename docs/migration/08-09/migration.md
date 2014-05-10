## Removal of default bodyParser injection

Due to the restructuring of the ``Context`` class we remove the default
middleware injection of ``json`` and ``urlencoded`` to the stack.  If you need
the bodyParser components inject them yourself in your context's
``preConfigure()`` method.

### The 0.9 code base

```js
/**
 * Worker context pre configure method.
 *
 * @param {Object} app - The application object
 * @param {Object} server - Server object
 * @param {Function} callback - Function to call on finish
 */
BlogContext.prototype.preConfigure = function(app, server, callback)
{
    // Use the body parser parts
    // The bodyParser will be removed with connect 3.0
    app.use(express.json());
    app.use(express.urlencoded());

    callback && callback();
};
```

## Open up of the Database Management

The big aim of this change is to enable clients to inject own database adapters
easily. If this aim is ensured the subsystem is more transparently to the
clients. Unfortunately we need to restructure the ``config.database`` namespace
of clients projects.

### The 0.8 config

```js
/**
 * Database connections
 */
config.database = {

    mongodb: {

        blog: {
            plain: true,
            orm: true,
            uri: "mongodb://127.0.0.1:27017/greppy_blog",
            options: {
                db: {
                    native_parser: true
                }
            }
        }
    }
};
```

### The 0.9 config

```js
/**
 * Database connections
 */
config.database = {

    blog: {
        adapter: {
            require: "greppy:mongodb",
            options: {
                plain: true,
                orm: true,
                uri: "mongodb://127.0.0.1:27017/greppy_blog",
                options: {
                    db: {
                        native_parser: true
                    }
                }
            }
        }
    }
};
```

You are able to load any valid module with the help of
``blog.adapter.require``.  Greppy first tries to load the module as it is. If
we don't find it and its prefixed with **greppy:** we search inside of Greppy
for a matching adapter. If we even not find a useable adapter we throw an
error.

