## Master

### Broadcast Listening

```js
setTimeout(function() {

    master.getIPC().broadcast('gracefull.shutdown', {
        shutdownTime: new Date()
    });

}, 2000);
```

### Interval based IPC request/response

```js
master.getIPC().addMethod('notify.request', function(msg, options, callback) {

    callback && callback(null, {
        test: ++options.test
    });
});
```

