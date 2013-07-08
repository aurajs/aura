/*global describe:true, it:true, before:true, beforeEach:true, afterEach:true, sinon:true */

define(['aura/aura', 'aura/ext/mediator'], function (aura, extension) {
  'use strict';

  describe('Mediator', function () {
    var app;
    var mediator;
    var config = { mediator: { maxListeners: 32 }, components: false };

    beforeEach(function (done) {
      app = aura(config);
      app.use(extension);
      app.start().done(function () {
        mediator = app.core.mediator;
        setTimeout(done, 0);
      });
    });

    describe('config', function() {
      it('should pass aura config to mediator', function() {
        mediator._conf.maxListeners.should.equal(32);
      });
    });

    describe('core', function () {
      describe('.mediator', function () {
        it('should augment app.core', function () {
          mediator.should.be.defined;
        });
      });
    });

    describe('sandbox', function () {
      var sandbox;
      beforeEach(function () {
        sandbox = app.sandboxes.create();
      });

      describe('#on', function () {
        it('should augment sandbox', function () {
          sandbox.on.should.be.a('function');
        });

        it('should add listener', function () {
          sandbox.on('test', function () {});
          mediator.listeners('test').should.have.length(1);
        });
      });

      describe('#off', function () {
        it('should augment sandbox', function () {
          sandbox.off.should.be.a('function');
        });

        it('should remove listener', function () {
          var listener = function () {};
          sandbox.on('test', listener);
          sandbox.off('test', listener);
          mediator.listeners('test').should.have.length(0);
        });
      });

      describe('#once', function() {
        it('should augment sandbox', function() {
          sandbox.once.should.be.a('function');
        });

        it('should add listener', function() {
          sandbox.once('test', function() {});
          mediator.listeners('test').should.have.length(1);
        });

        it('should remove listener after its called once', function(done) {
          sandbox.once('test', function() {
            mediator.listeners('test').should.have.length(0);
            done();
          });
          mediator.listeners('test').should.have.length(1);
          sandbox.emit('test');
        });
      });

      describe('#emit', function () {
        it('should augment sandbox', function () {
          sandbox.emit.should.be.a('function');
        });

        var spy;
        beforeEach(function () {
          spy = sinon.spy();
          sandbox.on('test', spy);
        });

        it('should trigger listener without param', function () {
          sandbox.emit('test');
          spy.should.have.been.called;
        });

        it('should trigger listener with params', function () {
          sandbox.emit('test', 'foo', 'bar');
          spy.should.have.been.calledWith('foo', 'bar');
        });
      });

      describe('#stopListening', function () {
        it('should augment sandbox', function () {
          sandbox.stopListening.should.be.a('function');
        });

        it('should remove all listeners when called without params', function () {
          var spy1 = sinon.spy();
          var spy2 = sinon.spy();
          sandbox.on('test1', spy1);
          sandbox.on('test2', spy2);
          sandbox.stopListening();
          sandbox.emit('test1');
          sandbox.emit('test2');

          spy1.should.not.have.been.called;
          spy2.should.not.have.been.called;
        });
      });
    });

    describe('catch exceptions in listeners', function() {
      var sandbox, first, second, troublemaker, spy1, spy2, spy3, spy4;

      beforeEach(function() {
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        spy4 = sinon.spy();
        var calledFirst = false;
        first = function() {
          calledFirst = true;
          spy1();
        };
        second = function() {
          if (calledFirst) {
            spy2();
          }
        };
        troublemaker = function() {
          spy3();
          if (calledFirst) {
            throw new Error('You die !');
          } else {
            throw new Error('You really die !');
          }
          spy4();
        };
        sandbox = app.sandboxes.create();
      });

      it('should call them in order', function() {
        sandbox.on('test', first);
        sandbox.on('test', second);
        sandbox.emit('test');
        spy2.should.have.been.called;
      });

      it('should really call them in order', function() {
        sandbox.on('test', second);
        sandbox.on('test', first);
        sandbox.emit('test');
        spy2.should.not.have.been.called;
      });

      it('should not calling callbacks if an exception is raised somewhere', function() {
        sandbox.on('test', first);
        sandbox.on('test', troublemaker);
        sandbox.on('test', second);
        sandbox.emit('test');
        spy2.should.have.been.called;
        spy3.should.have.been.called;
        spy4.should.not.have.been.called;
      });

    });

    describe('attaching context in listeners', function() {
      it('the sandbox should be the default context', function() {
        var context, sandbox = app.sandboxes.create();
        sandbox.on('test', function() {
          context = this;
        });
        sandbox.emit('test');
        context.should.equal(sandbox);
      });

      it('should be possible to override the default context', function() {
        var context, sandbox = app.sandboxes.create(), ctx = 'ctx';
        sandbox.on('test', function() {
          context = this;
        }, ctx);
        sandbox.emit('test');
        context.should.equal(ctx);
      });
    });

    describe('events', function () {
      describe('aura.sandbox.stop', function () {
        var spy;
        before(function () {
          spy = sinon.spy();
          var mock = { stopListening: spy };
          var event = ['aura', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
          mediator.emit(event, mock);
        });

        it('should call sandbox.stopListening', function () {
          spy.should.have.been.called;
        });
      });
    });
  });
});
