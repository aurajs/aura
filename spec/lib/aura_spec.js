define(['aura/aura'], function(aura) {

  'use strict';
  /*global describe:true, it:true, before: true, sinon: true */

  describe("Aura Apps", function() {
    describe("App Public API", function() {

      var ext = {
        init: sinon.spy(function(app) {
          app.sandbox.foo = "bar";
        }),
        afterAppStart: sinon.spy()
      };

      var App = aura();

      App.use(ext);

      var startOptions  = { foo: "bar" };
      var initStatus    = App.start(startOptions);

      // Make sure the app is started before...
      before(function(done) {
        initStatus.done(function() {
          done();
        });
        initStatus.fail(done);
      });

      it("Should have loaded its core dependencies", function() {
        App.core.data.deferred.should.be.a('function');
      });

      it("Should have a public API", function() {
        App.use.should.be.a('function');
        App.start.should.be.a('function');
        App.stop.should.be.a('function');
      });

      it("Should call init method on extension", function() {
        ext.init.should.have.been.calledWith(App);
      });

      it("Should call afterAppStart method on extension", function() {
        ext.afterAppStart.should.have.been.called; //With(App);
      });

      it("Should have extended the sandbox", function() {
        App.sandbox.foo.should.equal('bar');
      });

      it("Should complain if I try to use a new extension and the app is already started", function() {
        var use = function() { App.use(function() {}); };
        use.should.Throw(Error);
      });
    });

    describe("Defining and loading extensions", function() {

      it("Should be able to use extensions defined as objects", function(done) {
        var ext = { init: sinon.spy() };
        aura().use(ext).start({ widgets: [] }).done(function() {
          ext.init.should.have.been.called;
          done();
        });
      });

      it("Should be able to use extensions defined as functions", function(done) {
        var insideExt = sinon.spy();
        var ext = sinon.spy(function(appEnv) {
          insideExt('foo');
        });
        var App = aura().use(ext);
        App.start().done(function() {
          ext.should.have.been.calledWith(App);
          insideExt.should.have.been.calledWith('foo');
          done();
        });
      });

      it("Should pass the start options to the extensions...", function(done) {
        var startOptions = { foo: 'bar' };
        var insideExt = sinon.spy();
        var ext = sinon.spy(function(app) {
          insideExt(app.startOptions);
        });
        var App = aura().use(ext);
        App.start(startOptions).done(function() {
          ext.should.have.been.calledWith(App);
          insideExt.should.have.been.calledWith(startOptions);
          done();
        });
      });

      it("Should be able to use extensions defined as amd modules", function(done) {
        var ext = { init: sinon.spy() };
        define("myExtensionModule", ext);
        aura().use("myExtensionModule").start().done(function() {
          ext.init.should.have.been.called;
          done();
        });
      });
    });
  });
});
