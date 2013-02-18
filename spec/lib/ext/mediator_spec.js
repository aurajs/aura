/*global describe:true, it:true, before:true, beforeEach:true, afterEach:true, sinon:true */

define(['aura/aura', 'aura/ext/mediator'], function (aura, extension) {
  'use strict';

  describe('Mediator', function () {
    var app;
    var mediator;

    beforeEach(function (done) {
      app = aura();
      app.use(extension);
      app.start().done(function () {
        mediator = app.core.mediator;
        setTimeout(done, 0);
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
        sandbox = app.createSandbox();
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
