define(['aura/aura', 'aura/ext/widgets'], function (aura, ext) {
  'use strict';
  /*global describe:true, it:true, beforeEach:true, before:true, alert:true, sinon:true */

  var appConfig = { widgets: { sources: { 'default' : 'spec/widgets' } } };
  var appsContainer = $('<div>').attr('style', 'display:none');
  $('body').append(appsContainer);

  function buildAppMarkup(markup) {
    var container = $('<div/>').attr('id', _.uniqueId('widgets_spec_')).html(markup);
    appsContainer.append(container);
    return container;
  }

  function makeSpyWidget(name, definition) {
    // sourceName = sourceName || "default";
    if (!/\@/.test(name)) {
      name = name + '@default';
    }
    definition = definition || { initialize: sinon.spy() };
    var spyWidget = sinon.spy(function () { return definition; });
    define('__widget__$' + name, spyWidget);
    return spyWidget;
  }

  describe('Widgets API', function () {
    var app, BaseWidget;
    var yeahInit = sinon.spy();
    var yeahWidget = makeSpyWidget('yeah', { initialize: yeahInit });

    describe('Playing with Widgets', function () {
      beforeEach(function (done) {
        app = aura(appConfig);
        var container = buildAppMarkup('<div id="dummy-' + app.ref + '" data-aura-widget="dummy"></div><div data-aura-widget="yeah"></div>');
        app.start({ widgets: container }).then(function () {
          BaseWidget = app.core.Widgets.Base;
          done();
        });
      });

      describe('Widgets Extension', function () {
        it('Should define the widgets registry and base Widget on core', function () {
          app.core.Widgets.should.be.a('object');
          app.core.Widgets.Base.should.be.a('function');
        });
      });

      describe('Loading Widgets', function () {
        it('Should call the widget\'s initialize method on start', function () {
          yeahInit.should.have.been.called;
        });
      });

      describe('Starting Widgets', function () {

      });

      describe('Starting a list of widgets', function () {
        it('Should start the provided list of widgets', function () {
          var el = '#dummy-' + app.ref;
          var list = [{ name: 'dummy', options: { el: el } }];
          // TODO...
        });
      });
    });

    describe('Using alternate namespace for data-attributes...', function () {
      var app, options;

      var myAltWidget = makeSpyWidget('alt_namespace', {
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
                      ' data-super-widget="alt_namespace" ' +
                      ' data-super-param-name="value" ' +
                      ' data-super-foo="notbar" ' +
                      ' data-super-sourceUrl="url" ' +
                      ' data-super-fuNNy-Case-PaRAm="yep" ' +
                      ' data-super-param_name-With-un_der_scores="underscore"' +
                      '></div>';

        var container = buildAppMarkup(markup);

        app = aura({ namespace: 'super' });
        app.start({ widgets: container }).done(function () {
          setTimeout(done, 0);
        });
      });

      it('Data attributes with alternate namespace should be recognized', function () {
        myAltWidget.should.have.been.called;
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

    describe('Creating new Widget Types', function () {
      // a very simple widget type...
      var NewWidgetType = {
        foo: 'bar',
        initialize: function () {
          this.render(this.foo);
        }
      };

      // An extension to load it
      var ext = {
        initialize: function (app) {
          app.core.registerWidgetType('NewWidgetType', NewWidgetType);
        }
      };

      // the render method of the widget which will inherit from NewWidgetType
      var render = sinon.spy(function (content) {
        this.html(content);
      });

      // the actual widget
      var my_widget = {
        type: 'NewWidgetType',
        render: render,
        foo: 'nope'
      };

      makeSpyWidget('my_widget', my_widget);

      before(function (done) {
        var container = buildAppMarkup('<div data-aura-widget="my_widget"></div>');
        var app = aura(appConfig);
        app.use(ext).start({ widgets: container }).done(function () {
          // Hum... a little bit hacky
          // The promise resolves when the app is loaded...
          // not when the widgets are started...
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

    describe('Nesting Widgets', function () {
      // Nesting means that if a widget's markup contains data-aura-widget elements,
      // They should be started recursively
      var container = buildAppMarkup('<div data-aura-widget="parent"></div>');
      var childWidget = makeSpyWidget('child');
      before(function(done) {
        var parentWidget = makeSpyWidget('parent', {
          initialize: function() {
            this.html('<div data-aura-widget="child"></div>');
            setTimeout(done, 0);
          }
        });

        app = aura();
        app.start({ widgets: container });
      });

      it('Should should auto start the child widget once parent is rendered', function() {
        childWidget.should.have.been.called;
      });

    });

    describe('Adding new widgets source locations...', function () {
      var app;
      var myExternalWidget = makeSpyWidget('ext_widget@anotherSource');

      before(function (done) {
        app = aura();

        // Adding the source
        app.registerWidgetsSource('anotherSource', 'remoteWidgets');

        // app start...
        var container = buildAppMarkup('<div data-aura-widget="ext_widget@anotherSource"></div>');
        app.start({ widgets: container }).done(function () {
          setTimeout(done, 0);
        });
      });

      it('Should be possible to add new sources locations for widgets', function () {
        myExternalWidget.should.have.been.called;
      });

      it('Should complain if we try to add a source that has already been registered', function () {
        var err = function () { app.registerWidgetsSource('anotherSource', '...'); };
        err.should.Throw('Widgets source \'anotherSource\' is already registered');
      });
    });

    describe('Adding new widgets source via an extension', function () {
      var anExternalWidget = makeSpyWidget('ext_widget@aSource');

      var app, ext = {
        initialize: function (app) {
          app.registerWidgetsSource('aSource', 'aUrl');
        }
      };

      before(function (done) {
        var container = buildAppMarkup('<div data-aura-widget="ext_widget@aSource"></div>');
        app = aura();
        app.use(ext).start({ widgets: container }).done(function () { setTimeout(done, 0); });
      });

      it('Should load the source via the extension', function () {
        anExternalWidget.should.have.been.called;
      });
    });

    describe('sandbox', function () {
      var app;
      var sandbox;
      var mediator;
      before(function (done) {
        app = aura();
        app.start().done(function () {
          mediator = app.core.mediator;
          sandbox = app.createSandbox();
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
