# Aura Base

### what libraries are used here and required to run aura at the minimal level?

We need : 

- A Promise/A implementation
- and AMD loader
- a small subset of underscore (because coding without it sucks)
- an eventemitter implementation
- a selector engine 

Current status: 

- Promise/A: $jQuery
- AMD: requirejs, but it would be nice to test other ones (curl.js for example which is much smaller).
- underscore : we could make a minimal build of lodash and distribute it with aura.
- eventemitter2, for the moment. we could also have a look at postal.js which is extensible and may suit more our needs.
- the selector engine is required by the widgets extension, which is always included for the moment. but we don't really have to.

### since we're here, is their a minimum browser requirement for aura? a recommended browser/cpu requirement?

it should work everywhere. aura itself is really tiny !

We should have a way to CI on several browsers... ->

- http://vojtajina.github.com/testacular/
- http://yeti.cx/
- https://npmjs.org/package/bunyip
- https://npmjs.org/package/browserstack

### Does aura has a core functionality or extension to see if a browser can utilitize something, like hasjs? is this a potential extension idea?

  Not yet, but it would definitely be nice to have. 
  For the moment the `platform.js` file is a collection of polyfills for older browsers, but it does not really scale...
