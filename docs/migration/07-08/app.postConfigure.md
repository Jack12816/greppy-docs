## Removal of app.postConfigure

Due to the restructuring of the ``Context`` class we remove the deprecated
app.postConfigure() construct.  Now you are able to even hook into the core
boot process more deeply. With the help of ``Context.preConfigure()`` and
``Context.postConfigure()`` you can easily port your application to fit the new
needs.

### The 0.7 code base

```js
BlogContext.prototype.configure = function(app, server, callback)
{
    // [..]

    // Setup post configure hook
    app.postConfigure = function(app, server, callback) {

        // Add 404 error handler
        // Add error handler middleware
        // Do other post configure stuff

        callback && callback();
    };

    // [..]
};
```

### The 0.8 code base

```js
BlogContext.prototype.configure = function(app, server, callback)
{
    // [..]
};

/**
 * Worker context post configure method.
 *
 * @param {Object} app - The application object
 * @param {Object} server - Server object
 * @param {Function} callback - Function to call on finish
 */
BlogContext.prototype.postConfigure = function(app, server, callback)
{
    // Add 404 error handler
    // Add error handler middleware
    // Do other post configure stuff

    callback && callback();
};
```

