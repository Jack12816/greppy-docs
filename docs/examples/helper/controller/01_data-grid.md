### Data-Grid

#### Pagination without actual page

This is very usefull on big SQL tables where a count
takes very long.

```javascript
var count = function(callback) {

    // Only show prev/next buttons without counting.
    // So we can save time on very big tables, where
    // a exact pagination is irelevant.
    callback && callback({
        limit     : criteria.limit,
        page      : criteria.page,
        count     : 0,
        pageSizes : criteria.pageSizes
    });
};
```

