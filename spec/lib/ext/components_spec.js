define(['aura/aura', 'aura/ext/components'], function (aura, ext) {
  'use strict';
  /*global describe:true, it:true, beforeEach:true, before:true, alert:true, sinon:true */

  var appConfig = { components: { sources: { 'default' : 'spec/components' } } };
  var appsContainer = $('<div>').attr('style', 'display:none');
  $('body').append(appsContainer);

  function buildAppMarkup(markup) {
    var container = $('<div/>').attr('id', _.uniqueId('components_spec_')).html(markup);
    appsContainer.append(container);
    return container;
  }

  function makeSpyComponent(name, definition) {
    // sourceName = sourceName || "default";
    if (!/\@/.test(name)) {
      name = name + '@default';
    }
    definition = definition || { initialize: sinon.spy() };
    var spyComponent = sinon.spy(function () { return definition; });
    define('__component__$' + name, spyComponent);
    return spyComponent;
  }

  describe('Components API', function () {
    var app, BaseComponent;
    var yeahInit = sinon.spy();
    var yeahComponent = makeSpyComponent('yeah', { initialize: yeahInit });

    describe('Playing with Components', function () {
      beforeEach(function (done) {
        app = aura(appConfig);
        var container = buildAppMarkup('<div id="dummy-' + app.ref + '" data-aura-component="dummy"></div><div data-aura-component="yeah"></div>');
        app.start({ components: container }).then(function () {
          BaseComponent = app.core.Components.Base;
          done();
        });
      });

      describe('Components Extension', function () {
        it('Should define the components registry and base Component on core', function () {
          app.core.Components.should.be.a('object');
          app.core.Components.Base.should.be.a('function');
        });
      });

      describe('Loading Components', function () {
        it('Should call the component\'s initialize method on start', function () {
          yeahInit.should.have.been.called;
        });
      });

      describe('Starting Components', function () {

      });

      describe('Starting a list of components', function () {
        it('Should start the provided list of components', function () {
          var el = '#dummy-' + app.ref;
          var list = [{ name: 'dummy', options: { el: el } }];
          // TODO...
        });
      });
    });

    describe('Using legacy data-aura-widget attributes...', function () {

      var app, options;

      var myLegacyWidget = makeSpyComponent('legacy_widget', {
        initialize: function () {}
      });

      before(function (done) {
        var markup =  '<div data-aura-widget="legacy_widget"></div>';

        var container = buildAppMarkup(markup);

        app = aura();
        app.start({ components: container }).done(function () {
          setTimeout(done, 0);
        });
      });

      it('Legacy data-aura-widget attribute should be recognized', function () {
        myLegacyWidget.should.have.been.called;
      });

    });

    describe('Using alternate namespace for data-attributes...', function () {
      var app, options;

      var myAltComponent = makeSpyComponent('alt_namespace', {
        options: {
          foo: 'bar',
          another: 'toutafait'
        },
        initialize: function () {
          options = this.options;
        }
      });

      before(function (done) {
        var markup =  '<div ' +
                      ' data-super-component="alt_namespace" ' +
                      ' data-super-param-name="value" ' +
                      ' data-super-foo="notbar" ' +
                      ' data-super-sourceUrl="url" ' +
                      ' data-super-fuNNy-Case-PaRAm="yep" ' +
                      ' data-super-param_name-With-un_der_scores="underscore"' +
                      '></div>';

        var container = buildAppMarkup(markup);

        app = aura({ namespace: 'super' });
        app.start({ components: container }).done(function () {
          setTimeout(done, 0);
        });
      });

      it('Data attributes with alternate namespace should be recognized', function () {
        myAltComponent.should.have.been.called;
      });

      it('It should take the right options too...', function () {
        options.another.should.equal('toutafait');
        options.foo.should.equal('notbar');
        options.sourceurl.should.equal('url');
        options.paramName.should.equal('value');
        options.funnyCaseParam.should.equal('yep');
        options.param_nameWithUn_der_scores.should.equal('underscore');
      });
    });

    describe('Creating new Component Types', function () {
      // a very simple component type...
      var NewComponentType = {
        foo: 'bar',
        initialize: function () {
          this.render(this.foo);
        }
      };

      // An extension to load it
      var ext = {
        initialize: function (app) {
          app.components.addType('NewComponentType', NewComponentType);
        }
      };

      // the render method of the component which will inherit from NewComponentType
      var render = sinon.spy(function (content) {
        this.html(content);
      });

      // the actual component
      var my_component = {
        type: 'NewComponentType',
        render: render,
        foo: 'nope'
      };

      makeSpyComponent('my_component', my_component);

      before(function (done) {
        var container = buildAppMarkup('<div data-aura-component="my_component"></div>');
        var app = aura(appConfig);
        app.use(ext).start({ components: container }).done(function () {
          // Hum... a little bit hacky
          // The promise resolves when the app is loaded...
          // not when the components are started...
          // TODO: what should we do ?
          setTimeout(done, 0);
        });
      });

      it('Should use the right type if asked to...', function () {
        // The render method should have been called
        // from the initialize method of the parent type...
        render.should.have.been.calledWith('nope');
      });
    });

    describe('Nesting Components', function () {
      // Nesting means that if a component's markup contains data-aura-component elements,
      // They should be started recursively
      var container = buildAppMarkup('<div data-aura-component="parent"></div>');
      var childComponent = makeSpyComponent('child');
      before(function(done) {
        var parentComponent = makeSpyComponent('parent', {
          initialize: function() {
            this.html('<div data-aura-component="child"></div>');
            setTimeout(done, 0);
          }
        });

        app = aura();
        app.start({ components: container });
      });

      it('Should should auto start the child component once parent is rendered', function() {
        childComponent.should.have.been.called;
      });

    });

    describe('Adding new components source locations...', function () {
      var app;
      var myExternalComponent = makeSpyComponent('ext_component@anotherSource');

      before(function (done) {
        app = aura();

        // Adding the source
        app.components.addSource('anotherSource', 'remoteComponents');

        // app start...
        var container = buildAppMarkup('<div data-aura-component="ext_component@anotherSource"></div>');
        app.start({ components: container }).done(function () {
          setTimeout(done, 0);
        });
      });

      it('Should be possible to add new sources locations for components', function () {
        myExternalComponent.should.have.been.called;
      });

      it('Should complain if we try to add a source that has already been registered', function () {
        var err = function () { app.components.addSource('anotherSource', '...'); };
        err.should.Throw('Components source \'anotherSource\' is already registered');
      });
    });

    describe('Adding new components source via an extension', function () {
      var anExternalComponent = makeSpyComponent('ext_component@aSource');

      var app, ext = {
        initialize: function (app) {
          app.components.addSource('aSource', 'aUrl');
        }
      };

      before(function (done) {
        var container = buildAppMarkup('<div data-aura-component="ext_component@aSource"></div>');
        app = aura();
        app.use(ext).start({ components: container }).done(function () { setTimeout(done, 0); });
      });

      it('Should load the source via the extension', function () {
        anExternalComponent.should.have.been.called;
      });
    });

    describe('Components Callbacks', function(done) {
      var spy = sinon.spy();
      var spyAfter = sinon.spy();
      var spyCustom = sinon.spy();

      before(function(done) {
        var container = buildAppMarkup('<div id="a-component"></div>');
        var aComponent = makeSpyComponent('a_component_with_callbacks', {
          initialize: function() {
            if (this.beforeInitializeCalled) {
              spy();
              this.initializedCalled = true;
            }
          },
          myCustomMethod: function() {}
        });
        var app = aura();

        app.use(function(app) {
          app.components.before('initialize', function() {
            var self = this;
            var dfd = app.core.data.deferred();
            setTimeout(function() {
              self.beforeInitializeCalled = true;
              dfd.resolve();
            }, 10);
            return dfd.promise();
          });
          app.components.after('initialize', function() {
            if (this.initializedCalled) {
              spyAfter();
            }
            this.invokeWithCallbacks('myCustomMethod');
          });

          app.components.after('myCustomMethod', function() {
            spyCustom();
            this.sandbox.stop();
          });

          app.components.after('remove', function() {
            done();
          });
        });

        var yeah = { name: 'a_component_with_callbacks', options: { el: '#a-component', formidable: 'Tout a Fait' } };
        app.start([yeah]);
      });

      it('should have called the before callback before initialize', function() {
        spy.should.have.been.called;
        spyAfter.should.have.been.called;
        spyCustom.should.have.been.called;
      });
    });

    describe('sandbox', function () {
      var app;
      var sandbox;
      var mediator;
      before(function (done) {
        app = aura();
        app.start({ components: false }).done(function () {
          mediator = app.core.mediator;
          sandbox = app.sandboxes.create();
          setTimeout(done, 0);
        });
      });

      describe('#start', function () {
        it('should augment sandbox', function () {
          sandbox.start.should.be.a('function');
        });

        var spy;
        before(function () {
          spy = sinon.spy();
          mediator.on('aura.sandbox.start', spy);
          sandbox.start();
        });

        it('should emit aura.sandbox.start', function() {
          spy.should.have.been.called;
        });
      });

      describe('#stop', function () {
        it('should augment sandbox', function () {
          sandbox.stop.should.be.a('function');
        });

        var spy;
        before(function () {
          spy = sinon.spy();
          mediator.on('aura.sandbox.stop', spy);
          sandbox.stop();
        });

        it('should emit aura.sandbox.stop', function () {
          spy.should.have.been.called;
        });
      });
    });
  });
});
