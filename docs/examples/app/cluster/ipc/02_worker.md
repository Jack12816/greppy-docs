## Worker

### Broadcast Listening

```js
worker.getIPC().addBroadcastListener('gracefull.shutdown', function(err, result, msg) {
    console.log(err, result, msg);
});
```

### Interval based IPC request/response

```js
var i = 0;

setInterval(function() {

    worker.getIPC().request('notify.request', {
        test: i
    }, function(err, result, msg) {

        i = result.test;
        console.log('cb-worker-side', msg);
    });

}, 1000);
```

