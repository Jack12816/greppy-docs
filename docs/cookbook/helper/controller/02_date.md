## Dates

### Parse

```js
IndexController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        this.date.parse('2014-04-12 15:16:17');
        // => {Date}

        this.date.parse(req.body.input_name, 'DD.MM.YYYY');
        // Input was '12.04.2014'
        // => {Date}
    }
};
```

### Parse and return ISO 8601 string

```js
IndexController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        this.date.parseToIso('2014-04-12 15:16:17');
        // => '2014-04-12T13:16:17.000Z'

        this.date.parseToIso(req.body.input_name, 'DD.MM.YYYY');
        // Input was '12.04.2014'
        // => '2014-04-11T22:00:00.000Z'
    }
};
```

### Format

```js
IndexController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        this.date.format(new Date(), 'L');
        // => '04/12/2014'
        // See moment.js formating options

        this.date.format(new Date(), 'DD.MM.YYYY HH:mm:ss');
        // => '12.04.2014 15:26:23'
    }
};
```

### Compare

```js
```

