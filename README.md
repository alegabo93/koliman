# Koliman
Front end development for mining page.

## Quick start

~~~sh
$ git clone git@github.com:vinco/turba-front.git
$ npm install && bower install
$ gulp serve
~~~

Afterwards, depending on what you need:

* `gulp serve` to serve the project locally and open your browser, with livereload and sass sourcemaps for active development
* `gulp build` to compile everything into the dist directory (concatenation/minification of javascript, CSS and HTML; and optimization of images)
* `gulp serve:dist` is basically `gulp build` but also sets the webserver up to serve the built website directly (no livereload)

## Requirements

* [git](http://git-scm.com) 2.0+
* [ruby](http://www.ruby-lang.org) 2.0+ with [sass](http://sass-lang.com/) and [scss-lint](https://github.com/brigade/scss-lint) installed (`gem install sass scss-lint`)
* [node.js](https://nodejs.org) v0.10.x+ or [io.js](https://iojs.org) v1.0.0+
* [gulp](http://gulpjs.com) and [bower](http://bower.io) (`npm install -g gulp bower`)

## Other notes

On Windows, make sure that the following commands are available to you in the command prompt: `npm`, `bower`, `gulp`, `sass`, and `git`.

It is always a good idea to run `npm install` and `bower install` after each update (or `git pull` or similar), to make sure all dependencies are up-to-date and properly installed.

Install new gulp plugins and node modules with `npm install --save-dev <package>`, and new bower packages with `bower install --save <package>`. If `gulp serve` is already running, wiredep will automatically insert the scripts and stylesheets into the jade templates; otherwise, run `gulp wiredep`.
