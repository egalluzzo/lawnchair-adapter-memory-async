Asynchronous in-memory adapter for Lawnchair
============================================

The default [in-memory adapter](https://github.com/brianleroux/lawnchair/blob/master/src/adapters/memory.js)
for [Lawnchair](http://brian.io/lawnchair/) is synchronous.  However, for test
cases, it can be useful to simulate asynchronous behavior.

Usage
-----

Include `lawnchair-adapter-memory-async.js` and the main Lawnchair JS file in
your HTML, then:

    var mydb = Lawnchair({
        name: 'mydb',
        adapter: 'memory-async',
        timeout: 50
    });

The timeout is optional and defaults to 20 milliseconds.  The timeout is
constant for all operations, including `batch`.

