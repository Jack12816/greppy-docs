[![Greppy Docs logo](http://greppy.org/img/greppy-docs-teaser.png)](http://greppy.org/)

This is the documentation for the Greppy Framework.

For more details take a look at [greppy.org](http://greppy.org) or the
[Greppy API](http://docs.greppy.org/). If you got any problems, a wish to
contribute or to discuss new features take a look at our #greppy IRC channel on
freenode.

[![Gittip](http://img.shields.io/gittip/Jack12816.png)](https://www.gittip.com/Jack12816/)

## Contributing

For getting started you need a proper build environment.
You need to install all necessary node.js [packages](/package.json) and
some frontend assets, like [Bootstrap](http://getbootstrap.com/) and
[jQuery](http://jquery.com/). To setup the documentation build
environment just run:

    $ make install

The build of the documentation will be located in a new created
directory named **docs/**. All further builds will not clear the
first build, they will only extend the build. Build the
documentation with:

    $ make build

If you like to clear the build directory, just run:

    $ make clean

You can serve the builded documentation with a standalone
server which is listening on localhost:9000. Start the
server with:

    $ make serve

You could start a process which watches all files for
changes and automatically rebuild the documentation.
This is great while you working on it. Start it with:

    $ make watch

