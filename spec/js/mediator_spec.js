var SANDBOX1 = 'test_widget',
    SANDBOX2 = 'test_sandbox2',
  TEST_EVENT = 'stub';

define('sandbox_perms', ['aura_perms'], function(permissions) {
  'use strict';

  var channelPerms = {};
  channelPerms[SANDBOX1] = {};
  channelPerms[SANDBOX1][SANDBOX2] = true;

  /* the above is equivalent to: 
  {
    test_widget: {
      'test_sandbox2': true // this is a channel
    }
  };
  */

  channelPerms['test_emitqueue'] = {
    '*': true
  };

  permissions.extend(channelPerms);

  return permissions;
});

define('spec/js/widgets/test_emitqueue/main', ['sandbox'], function(sandbox) {
  'use strict';

  return function(options) {};
});

define('spec/js/widgets/test_widget/main', ['sandbox'], function(sandbox) {
  'use strict';

  return function() {};
});

define(['aura_core', 'aura_sandbox', 'sandbox_perms'], function(mediator, aura_sandbox, permissions) {
  var sandboxes = {};

  sandboxes[SANDBOX1] = {
    options: {
      element: '#sample_widget'
    }
  };
  mediator.start(sandboxes);

  describe('mediator', function() {
    describe('pubsub', function() {
      //override method util as it uses jQuery proxy and doesn't
      //allow comparison of actual callback function object.

      beforeEach(function() {
        // verify setup
        expect(mediator).toBeDefined();

      });


      describe('listeners', function() {
        describe('verification of parameters', function() {
          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              mediator.listeners();
            }).toThrow(new Error('Event must be defined'));
          });
          it("should throw an error if typeof event is NOT a string or array in EventEmitter format", function() {
            expect(function() {
              mediator.listeners({});
            }).toThrow(new Error('Event must be an EventEmitter compatible argument (string or array)'));
          });
        });
      });

      describe('removing listeners', function() {
        afterEach(function() {
          mediator.removeAllListeners();
        });

        describe('removeAllListeners', function() {

          it('should remove all listeners', function() {

            mediator.removeAllListeners();
            expect(mediator.listeners('test.**.ptrn').length).toBe(0);
          });

          it('should remove all listeners with arguments', function() {
            mediator.removeAllListeners(TEST_EVENT);
            expect(mediator.listeners('test.**.ptrn').length).toBe(0);
          });


        });

      });

      describe('on (subscribe / listen)', function() {

        beforeEach(function() {
          mediator.removeAllListeners();
        });

        describe('verification of parameters', function() {
          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              mediator.on();
            }).toThrow(new Error('Event, callback, and context must be defined'));
          });

          it("should throw an error if typeof event is NOT a string or array in EventEmitter format", function() {
            expect(function() {
              mediator.on({}, function() {}, {});
            }).toThrow(new Error('Event must be an EventEmitter compatible argument (string or array)'));
          });

          it("should throw an error if typeof callback is NOT a function", function() {
            expect(function() {
              mediator.on(TEST_EVENT, {}, {});
            }).toThrow(new Error('Callback must be a function'));
            expect(function() {
              mediator.on(TEST_EVENT, 'string text', {});
            }).toThrow(new Error('Callback must be a function'));

          });
        });


        it('should allow an event to be subscribed', function() {
          mediator.on(TEST_EVENT, function() {}, this);

          expect(mediator.listeners(TEST_EVENT).length).toBe(1);
        });

        it('should be able assign a specific callback for subscribed event', function() {
          var callback, callbackResult = 'callback';
          mediator.on(TEST_EVENT, function() {}, this);

          mediator.on(TEST_EVENT, function() {
            return callbackResult;
          }, this);

          callback = mediator.listeners(TEST_EVENT)[1];
          expect(callback()).toBe(callbackResult);
        });

        it('should allow subscribing multiple callbacks for single event', function() {
          var callback1 = function() {};
          var callback2 = function() {};

          mediator.on(TEST_EVENT, callback1, this);
          mediator.on(TEST_EVENT, callback2, this);

          expect(mediator.listeners(TEST_EVENT).length).toBe(2);
        });

        it('should allow subscribing for catchall \'*\' events', function() {
          var callback1 = function() {};

          mediator.on('*', callback1, this);
          expect(mediator.listeners('*').length).toBe(1);
          expect(mediator.listeners('banana').length).toBe(1);
          expect(mediator.listeners('banana.notthis').length).toBe(0);
          //expect(mediator.listenersAny().length).toBe(1);
        });

        it('should allow subscribing for catchall \'**\' events', function() {
          var callback1 = function() {};

          mediator.on('**', callback1, this);
          expect(mediator.listeners(TEST_EVENT).length).toBe(1);
          expect(mediator.listeners('apple').length).toBe(1);
          expect(mediator.listeners('apple.cakes').length).toBe(1);
          expect(mediator.listeners('apple.cakes.cats').length).toBe(1);
          //expect(mediator.listenersAny().length).toBe(1);
        });

        describe('should allow namespaces and wildcards', function() {

          it('should allow subscribing for namespaces, 2 level', function() {
            var callback1 = function() {};

            mediator.on('test.dat', callback1, this);
            expect(mediator.listeners('test.dat').length).toBe(1);
            expect(mediator.listeners('test.*').length).toBe(1);
            expect(mediator.listeners('test.**').length).toBe(1);
          });

          it('should allow subscribing for namespaces, 3 level, wildcard', function() {
            var callback1 = function() {};

            mediator.on('test.dis.ptrn', callback1, this);
            expect(mediator.listeners('test.dis.ptrn').length).toBe(1);
            expect(mediator.listeners('test.*.ptrn').length).toBe(1);
            expect(mediator.listeners('test.**.ptrn').length).toBe(1);
          });

          it('should allow subscribing for namespaces, 4 level, wildcard + **', function() {
            var callback1 = function() {};

            mediator.on('test2ns.khal.drogo.no', callback1, this);
            expect(mediator.listeners('test2ns.khal.drogo.no').length).toBe(1);
            expect(mediator.listeners('test2ns.*.no').length).toBe(0);
            expect(mediator.listeners('test2ns.**.no').length).toBe(1);
          });

        });


      });

      describe('emit (publish / trigger)', function() {
        describe('verification of parameters', function() {
          beforeEach(function() {
            mediator.removeAllListeners();
          });

          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              mediator.emit();
            }).toThrow(new Error('Event must be defined'));
          });

          it("should throw an error if typeof event is NOT a string or array in EventEmitter format", function() {
            expect(function() {
              mediator.emit({});
            }).toThrow(new Error('Event must be an EventEmitter compatible argument (string or array)'));
          });

        });

        it('should call every callback for an event, within the correct context', function() {
          var callback = sinon.spy();

          mediator.on(TEST_EVENT, callback, this);

          mediator.emit(TEST_EVENT);

          expect(callback).toHaveBeenCalled();
        });

        it('should pass additional arguments to every call callback for a channel', function() {
          var callback = sinon.spy();
          var argument = {};

          mediator.on(TEST_EVENT, callback, this);

          mediator.emit(TEST_EVENT, argument);

          expect(callback).toHaveBeenCalledWith(argument);
        });

      });



      describe('permissions', function() {
        xdescribe('declarative and simple input', function() {
          it('should allow adding simple', function() {});
          it('should allow adding basic', function() {});
        });

        xit('should allow permission publish to all sandboxes with *');
        xit('should allow permission listen to all sandboxes with *');
        it('should exist when extended with sandbox perms', function() {
          expect(permissions).toBeDefined();
        });

        describe('verification of parameters', function() {
          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              permissions.validate();
            }).toThrow(new Error('Subscriber and channel must be defined'));
          });

          it("should throw an error if subscriber is NOT a string", function() {
            expect(function() {
              permissions.validate({}, SANDBOX2);;
            }).toThrow(new Error('Subscriber must be a string'));
          });

          it("should throw an error if channel is NOT a string", function() {
            
            expect(function() {
              permissions.validate(SANDBOX1, {});;
            }).toThrow(new Error('Channel must be a string'));
          });

        });

        describe('validate', function() {
          it('should have validation method', function() {
            expect(permissions.validate).toBeDefined();
          });
          it('should validate if channel is permitted on the sandbox', function() {
            expect(permissions.validate(SANDBOX2, SANDBOX1)).toBeTruthy();
          });
          it('should not validate if channel is permitted on the sandbox', function() {
            expect(permissions.validate(SANDBOX2, 'notasandbox')).toBeFalsy();
            expect(permissions.validate('yo ha', SANDBOX1)).toBeFalsy();
            expect(permissions.validate('yo ha', 'notasandbox')).toBeFalsy();
          });

          //it('should load permissions declaratively via obj literal of \'emit\' and \'on\'', function() {
        });
      });


    }); // describe('mediator')




    describe('sandbox', function() {
      var sandbox;

      it('should allow a sandbox to be created', function() {
        sandbox = aura_sandbox.create(mediator, SANDBOX1, permissions);

        expect(sandbox).not.toBeNull();
        expect(sandbox).toBeDefined();
      });

      describe('on (subscribe / listen)', function() {

        beforeEach(function() {

          mediator.removeAllListeners();
        });

        describe('verification of parameters', function() {
          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              sandbox.on();
            }).toThrow(new Error('Event and callback must be defined'));
          });

          it("should throw an error if typeof event is NOT a string or array in EventEmitter format", function() {
            expect(function() {
              sandbox.on({}, function() {}, this);
            }).toThrow(new Error('Event must be an EventEmitter compatible argument (string or array)'));
          });

          it("should throw an error if typeof callback is NOT a function", function() {
            expect(function() {
              sandbox.on(TEST_EVENT, {}, this);
            }).toThrow(new Error('Callback must be a function'));
          });
        });


        it('should allow an event to be subscribed', function() {
          var callback = function() {};

          sandbox.on(TEST_EVENT, callback, this);

          expect(sandbox.listeners(TEST_EVENT).length).toBe(1);
        });

        it('should be able assign a specific callback for subscribed event', function() {
          var callback, callbackResult = 'callback';
          sandbox.on(TEST_EVENT, function() {}, this);

          sandbox.on(TEST_EVENT, function() {
            return callbackResult;
          }, this);
          callback = sandbox.listeners(TEST_EVENT)[1];
          expect(callback()).toBe(callbackResult);
        });

        it('should allow subscribing multiple callbacks for single event', function() {

          var callback1 = function() {};
          var callback2 = function() {};

          sandbox.on(TEST_EVENT, callback1, this);
          sandbox.on(TEST_EVENT, callback2, this);

          expect(sandbox.listeners(TEST_EVENT).length).toBe(2);
        });

        it('should allow subscribing for catchall \'*\' events', function() {
          var callback1 = function() {};

          sandbox.on('*', callback1, this);
          expect(sandbox.listeners(TEST_EVENT).length).toBe(1);
          //expect(sandbox.listenersAny().length).toBe(1);
        });

        it('should allow subscribing for catchall \'**\' events', function() {
          var callback1 = function() {};

          sandbox.on('**', callback1, this);
          expect(sandbox.listeners(TEST_EVENT).length).toBe(1);
          //expect(sandbox.listenersAny().length).toBe(1);
        });

        describe('should allow namespaces and wildcards', function() {

          it('should allow subscribing for namespaces, 2 level', function() {
            var callback1 = function() {};

            sandbox.on('test.dat', callback1, this);
            expect(sandbox.listeners('test.dat').length).toBe(1);
            expect(sandbox.listeners('test.*').length).toBe(1);
            expect(sandbox.listeners('test.**').length).toBe(1);
          });

          it('should allow subscribing for namespaces, 3 level, wildcard', function() {
            var callback1 = function() {};

            sandbox.on('test.dis.ptrn', callback1, this);
            expect(sandbox.listeners('test.dis.ptrn').length).toBe(1);
            expect(sandbox.listeners('test.*.ptrn').length).toBe(1);
            expect(sandbox.listeners('test.**.ptrn').length).toBe(1);
          });

          it('should allow subscribing for namespaces, 4 level, wildcard + **', function() {
            var callback1 = function() {};

            sandbox.on('test2ns.khal.drogo.no', callback1, this);
            expect(sandbox.listeners('test2ns.khal.drogo.no').length).toBe(1);
            expect(sandbox.listeners('test2ns.*.no').length).toBe(0);
            expect(sandbox.listeners('test2ns.**.no').length).toBe(1);
          });

        });


      });

      describe('emit (publish / trigger)', function() {

        beforeEach(function() {
          mediator.removeSandboxListeners(SANDBOX1);
        });

        describe('verification of parameters', function() {
          it('should throw an error if all the params are not specified', function() {
            expect(function() {
              sandbox.emit();
            }).toThrow(new Error('Event must be defined'));
          });

          it("should throw an error if typeof event is NOT a string or array in EventEmitter format", function() {
            expect(function() {
              sandbox.emit({});
            }).toThrow(new Error('Event must be an EventEmitter compatible argument (string or array)'));
          });

        });

        it('should call every callback for an event, within the correct context', function() {
          mediator.removeAllListeners();
          var callback = sinon.spy();

          sandbox.on(TEST_EVENT, callback, this);
          sandbox.emit(TEST_EVENT);

          expect(callback).toHaveBeenCalled();
        });

        it('should pass additional arguments to every call callback for an event', function() {
          var callback = sinon.spy();
          var argument = {};

          sandbox.on(TEST_EVENT, callback, this);

          sandbox.emit(TEST_EVENT, argument);

          expect(callback).toHaveBeenCalledWith(argument);
        });

      });


    });

      describe('emitqueue', function() {
        beforeEach(function() {
          mediator.removeAllListeners();
        });
        it('should add to emit queue if widget is loading', function() {

          mediator.start({
            test_emitqueue: {
              options: {
                element: '#test_emitqueue'
              }
            }
          });

          mediator.emit('test_emitqueue.hi');

          expect(mediator.getEmitQueueLength()).toBe(1);
        });

      });


    xdescribe('widgets', function() {
      xdescribe('start', function() {
        it('should throw an error if all the params are not specified', function() {});
        it('should throw an error if all the params are not the correct type', function() {});
        it('should load (require) a widget that corresponds with a channel', function() {});
        it('should call every callback for the channel, within the correct context', function() {});
        it('should trigger a requirejs error if the widget does not exist', function() {});
      });

      xdescribe('stop', function() {
        it('should throw an error if all the params are not specified', function() {});
        it('should throw an error if all the params are not the correct type', function() {});
        it('should call unload with the correct widget to unload from the app', function() {});
        it('should empty the contents of a specific widget\'s container div', function() {});
      });

      // This one will need to be researched a little more to determine exactly what require does
      xdescribe('unload', function() {
        it('should throw an error if all the params are not specified', function() {});
        it('should throw an error if all the params are not the correct type', function() {});
        it('should unload a module and all modules under its widget path', function() {});
      });
    });
  });
});
