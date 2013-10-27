## Master

### Broadcast Listening

```javascript
    setTimeout(function() {

        master.getIPC().broadcast('gracefull.shutdown', {
            shutdownTime: new Date()
        });

    }, 2000);
```

### Interval based IPC request/response

```javascript
    master.getIPC().addMethod('notify.request', function(msg, options, callback) {

        callback && callback(null, {
            test: ++options.test
        });
    });
```

