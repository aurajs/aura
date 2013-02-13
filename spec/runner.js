var should;
define(['chai', 'sinonChai'], function(chai, sinonChai) {

  window.chai         = chai;
  window.expect       = chai.expect;
  window.assert       = chai.assert;
  window.sinonChai    = sinonChai;
  should              = chai.should();
  chai.use(sinonChai);
  
  mocha.setup('bdd');
  
  console = window.console || function() {};
 
  // Don't track
  window.notrack = true;

  var specs = [
    'spec/lib/aura_spec',
    'spec/lib/aura.extensions_spec',
    'spec/lib/ext/widgets_spec',
    // 'spec/lib/ext/mediator_spec'
  ]
  require(specs, runMocha);
 
});
