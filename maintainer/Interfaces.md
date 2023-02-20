# pwix:accounts - maintainer/Interfaces

## Interface usage

The usage of Interface in `pwix:accounts` package implies the use of dynamically attributed class names.

This works well in development environment.

But when building the production bundle, Meteor applies a minification process which - in particular - leads to classes names mangling (renaming).
This implies that the Interface philosophy based on class names no more works.

We so MUST find a way to not modify these classes names, or to give up with Interface usage in Meteor application (which would be the very last option).

As of 2023- 2-15 and Meteor 2.10, a temporary work-around is to build the deployed bundle with the `--debug` flag.

As of 2023- 2-19 and Meteor 2.10, the only found work-around is to just build the bundle without any minification. Unfortunately this option applies to the whole application.

So decision is taken to get rid of the Interfaces, and come back to the good old DOM components system (todo #45).

The interface code is nonetheless kept in `interfaces` git branch.

### Minification in Meteor

Meteor makes use of `standard-minifier-js` package to process the minification of JS files.

Under the hood, Meteor is saif to use `UglyfyJS`, but - as of Meteor 2.10.0 - UglifyJS is said deprecated for the benefit of `Terser`.

See [/home/pierre/.meteor/packages/standard-minifier-js/.2.8.1.103pr0l.sq1a++os+web.browser+web.browser.legacy+web.cordova/plugin.minifyStdJS.os/npm/node_modules/meteor/minifier-js/node_modules/terser/bin/uglifyjs](/home/pierre/.meteor/packages/standard-minifier-js/.2.8.1.103pr0l.sq1a++os+web.browser+web.browser.legacy+web.cordova/plugin.minifyStdJS.os/npm/node_modules/meteor/minifier-js/node_modules/terser/bin/uglifyjs)

### Our tests

- the [#5329](https://github.com/meteor/meteor/issues/5329) Meteor issue proposed a `{ minify: false }` option.

    This has been tested in `minify_false` branch:

```
    api.mainModule( 'src/client/js/index.js', 'client', { minify: false });
```

But this has no effect on minification process.

Actually, seems the PR has not been accepted.

- as `standard-minifier-js` doesn't consider already minified files, we try to rename all class and interfaces files to .min.js

    This was [#5363](https://github.com/meteor/meteor/issues/5363) Meteor PR.

    Unfortunately, the minification process doesn't like that:

```
    While minifying app code:
    packages/minifyStdJS/plugin/minify-js.js:49:25: terser minification error (SyntaxError:"Import" statement may only appear at the top level)
```

According to [#10393](https://github.com/meteor/meteor/issues/10393), "It doesn't make sense that there would still be import syntax in the code that's being minified."

I understand that a 'min.js' file, because it is expected to be already minified, shouldn't have any `import nor `Class` keywords, but only very standard Javascript functions.

So doesn't seem to be a good track to follow.

- try to pass the `keep_classnames` terser option to minify code

    Set the option in `/home/pierre/.meteor/packages/minifier-js/.2.7.5.1snnc9f.i9sxj++os+web.browser+web.browser.legacy+web.cordova/web.browser/minifier.js` doesn't seem to work

```
    const options = {
        keep_classnames: true,
        compress: {
            drop_debugger: false,  // remove debugger; statements
            unused: false,         // drop unreferenced functions and variables
            dead_code: true,       // remove unreachable code
            typeofs: false,        // set to false due to known issues in IE10
            global_defs: {
                "process.env.NODE_ENV": NODE_ENV
            }
        },
        // Fix issue #9866, as explained in this comment:
        // https://github.com/mishoo/UglifyJS2/issues/1753#issuecomment-324814782
        // And fix terser issue #117: https://github.com/terser-js/terser/issues/117
        safari10: true,          // set this option to true to work around the Safari 10/11 await bug
```

No more luck, but not even sure this code is really executed as a console.log doesn't output anything. Throwing an error doesn't work either.

- last option is to juste remove the minifier for the whole application

    Some tests:

    - `meteor build`: bundle is 60MB, minified (buggy) version, 

    - `meteor build --debug`:  bundle is 64MB, not minified

    - removing the minifier for the whole application

```
    $ meteor remove standard-minifier-js
                                                
    Changes to your project's package version selections:
                                                
    minifier-js           removed from your project
    standard-minifier-js  removed from your project

    standard-minifier-js: removed dependency
```

`meteor build`:  bundle is 64MB, same size

So, minifying - and all the above hard work, is just there to gain 4MB, just a bit more than 6%. Not worthwhile in that case.

### References

- [`standard-minifier-js` on Github](https://github.com/meteor/meteor/tree/master/packages/standard-minifier-js)

- [`minifier-js`](https://github.com/meteor/meteor/tree/master/packages/minifier-js)

- [`Terser`](https://github.com/terser/terser)

## Why Interfaces are a good system ?

Interfaces let us put together all related methods, whatever be the implementation class, while leaving to this same implementation class the implementation details.

After having written many thousands of lines of code in C, C++, or using the GLib and GObject Gnome libraries, I have built myself the philosophy that:

- classes should hold the object data

- while interfaces gather the methods.

This way, the classes are much more easier to design, as we only look at which data go to which class.

And the interfaces may be developped as needed, most probably each interface implemented by several classes.

The produced code appears to me more clearer. For example, you do not pass a class instance to a method when you are only interested by the interface it implements. Just pass the interface object, and that's done.

There are nonetheless one inconvenience as this may lead the developer to design many very small interfaces, so this may add some boilerplate code to the whole.

IMHO, this inconvenient is small regarding the much more clear code we obtain.

---
P. Wieser
- Last updated on 2023, Feb. 19th.
