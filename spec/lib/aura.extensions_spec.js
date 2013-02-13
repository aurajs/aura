define(['aura/aura.extensions'], function(ExtManager) {

  'use strict';
  /*global describe:true, it:true, before: true, sinon: true */

  describe("ExtManager", function() {

    it("should be a constructor", function() {
      ExtManager.should.be.a('function');
    });


    describe("ExtManager.prototype", function() {

      var proto = ExtManager.prototype;

      it("should have a init function", function() {
        proto.init.should.be.a('function');
      });

      it("should have a add function", function() {
        proto.add.should.be.a('function');
      });

      it("should have a onReady function", function() {
        proto.onReady.should.be.a('function');
      });

      it("should have a onFailure function", function() {
        proto.onFailure.should.be.a('function');
      });

    });

    describe("Adding extensions", function() {

      it("Should be possible to add extensions", function(done) {
        var mgr = new ExtManager(),
            ext1 = { ref: sinon.spy(), context: "ext1" }, 
            ext2 = { ref: sinon.spy(), context: "ext2" };
        
        mgr.add(ext1);
        mgr.add(ext2);

        var init = mgr.init();
        init.done(function() {
          ext1.ref.should.have.been.calledWith(ext1.context);
          ext2.ref.should.have.been.calledWith(ext2.context);
          done();
        });
      });

      it("Should not be possible to add an extension twice", function() {
        var mgr = new ExtManager(),
            ext = { ref: sinon.spy(), context: '123' };
        var addExt = function() { mgr.add(ext); };
        addExt();
        addExt.should.Throw(Error);
      });

      it("Should ensure extensions are loaded sequentially", function(done) {
        var mgr = new ExtManager(),
            ctx = { foo: "Bar" },
            ext1 = { init: function(c) { 
              var later = $.Deferred();
              _.delay(function() { 
                c.ext1Loaded = true; 
                later.resolve();
              }, 100);
              return later;
            }},
            ext2 = function(c) { c.ext1Loaded.should.equal(true); };
        mgr.add({ ref: ext1, context: ctx });
        mgr.add({ ref: ext2, context: ctx });
        mgr.init().done(function() {
          done();
        });
      });

      it("Should be possible to add an extension via its module ref name", function(done) {
        var mgr = new ExtManager(),
            ext = { init: sinon.spy(), foo: "bar" },
            ctx = { foo: "bar" };

        define("myExt", ext);
        mgr.add({ ref: "myExt", context: ctx });
        mgr.init().done(function(extResolved) {
          extResolved[0].foo.should.equal("bar");
          ext.init.should.have.been.calledWith(ctx);
          done();
        });
      });
    });

    describe("Error handling", function() {
      
      it("Should fail init if a ext ref is not found", function(done) {
        new ExtManager().add({ ref: "nope" }).init().fail(function() {
          done();
        });
      });

      it("Should fail init if a dependency is not found", function(done) {
        var ext = { require: { paths: { not_here: 'not_here' } }, init: sinon.spy() },
            mgr = new ExtManager();
        mgr.add({ ref: ext });
        mgr.init().fail(function() {
          done();
        });
      });

    });

    describe("Lifecycle", function() {

      it("Should call onReady callbacks when all extensions have been loaded", function(done) {
        var mgr       = new ExtManager(),
            ctx       = {},
            ready     = sinon.spy(),
            alsoReady = sinon.spy();
        define("ext1", { init: function(c) { c.one = true; } });
        define("ext2", { init: function(c) { c.two = true; } });
        mgr.add({ ref: "ext1", context: ctx });
        mgr.add({ ref: "ext2", context: ctx });
        mgr.onReady(ready);
        mgr.onReady(alsoReady);
        var init = mgr.init();
        init.then(function() {
          ready.should.have.been.called;
          alsoReady.should.have.been.called;
          done();
        });
      });

      it("Should call onFailure callbacks when init has failed", function(done) {
        var onFail = sinon.spy(),
            mgr    = new ExtManager().add({ ref: { init: function() { throw new Error('FAIL'); }} });
        mgr.onFailure(onFail);
        mgr.init().always(function() {
          onFail.should.have.been.called;
          done();
        });
      });
    });


  });

});