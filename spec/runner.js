/*global define mocha */
var should;

require.config({
  baseUrl: '../',
  paths: {
    components: 'components',
    aura: 'lib',
    aura_components: 'spec/aura_components',
    chai: 'node_modules/chai/chai',
    sinonChai:'node_modules/sinon-chai/lib/sinon-chai'
  }
});

define(['chai', 'sinonChai'], function (chai, sinonChai) {
  window.chai = chai;
  window.expect = chai.expect;
  window.assert = chai.assert;
  window.should = chai.should();
  window.sinonChai = sinonChai;
  window.notrack = true;

  chai.use(sinonChai);
  mocha.setup('bdd');

  require([
    'spec/lib/aura_spec',
    'spec/lib/aura.extensions_spec',
    'spec/lib/ext/components_spec',
    'spec/lib/ext/mediator_spec'
  ], function () {
    mocha.run();
  });
});
