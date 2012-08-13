describe('Mediator', function () {

	var mediator,
		channels,
		TEST_CHANNEL = 'test';


	beforeEach(function() {
		mediator = window.core;
        channels = mediator.getChannels();

        //override method util as it uses jQuery proxy and doesn't
        //allow comparison of actual callback function object.
        mediator.util.method = function (fn, context) {
            return fn;
        };

        //verify setup
		expect(mediator).toBeDefined();
		expect(channels).toBeDefined();

		delete channels[TEST_CHANNEL]; //clean our test channel
	});

	describe('subscribe', function() {

        describe('verification of parameters', function() {
            it('should throw an error if all the params are not specified', function () {
                expect(function () {
                    mediator.subscribe();
                }).toThrow(new Error('Channel, callback, and context must be defined'));
            });

            it("should throw an error if typeof channel is NOT string", function() {
                expect(function() {
                    mediator.subscribe({}, 'subscriber', function () {}, {})
                }).toThrow(new Error('Channel must be a string'));
            });

            it("should throw an error if typeof subscriber is NOT string", function() {
                expect(function() {
                    mediator.subscribe('channel', {}, function(){}, {})
                }).toThrow(new Error('Subscriber must be a string'));
            })

            it("should throw an error if typeof callback is NOT a function", function() {
                expect(function() {
                    mediator.subscribe('channel', 'subscriber', 'callback', {})
                }).toThrow(new Error('Callback must be a function'));
            });
        });

		it('should allow an event to be subscribed', function() {
			mediator.subscribe(TEST_CHANNEL, 'spec', function() {}, this);
			expect(channels[TEST_CHANNEL]).toBeDefined();
		});

		it('should be able assign a specific callback for subscribed event', function() {
			var callback,
					callbackResult = 'callback';
			mediator.subscribe(TEST_CHANNEL, 'spec', function() { return callbackResult; }, this);
			callback = channels[TEST_CHANNEL][0].callback;
			expect(callback()).toBe(callbackResult);
		});

		it('should allow subscribing multiple callbacks for single event channel', function() {
			var callback1 = function() {};
			var callback2 = function() {};

			mediator.subscribe(TEST_CHANNEL, 'spec', callback1, this);
			mediator.subscribe(TEST_CHANNEL, 'spec', callback2, this);

			//expect(channels[TEST_CHANNEL]).toContain(callback1, callback2);
			expect(channels[TEST_CHANNEL].length).toBe(2);
		});
	});

	describe('publish', function() {

        describe('verification of parameters', function() {
            it('should throw an error if all the params are not specified', function () {
                expect(function () {
                    mediator.publish();
                }).toThrow(new Error('Channel must be defined'));
            });

            it('should throw an error if typeof channel param is not string', function () {
                expect(function () {
                    mediator.publish({});
                }).toThrow(new Error('Channel must be a string'));
            });
        });

		it('should call every callback for a channel, within the correct context', function () {
            var callback = sinon.spy();
            channels[TEST_CHANNEL] = [
                {callback:callback}
            ];

            mediator.publish(TEST_CHANNEL);

            expect(callback).toHaveBeenCalled();
        });

		it('should pass additional arguments to every call callback for a channel', function () {
            var callback = sinon.spy();
            var argument = {};
            channels[TEST_CHANNEL] = [
                {callback:callback}
            ];

            mediator.publish(TEST_CHANNEL, argument);

            expect(callback).toHaveBeenCalledWith(argument);
        });

		it('should return false if channel has not been defined', function () {
            var called = mediator.publish(TEST_CHANNEL);
            expect(called).toBe(false);
        });

        it('should add to publish queue if widget is loading', function() {
            channels[TEST_CHANNEL] = [
                {callback:function() {}}
            ];
            mediator.start({ channel:TEST_CHANNEL, element:'#nothing' });

            mediator.publish(TEST_CHANNEL);

            expect(mediator.getPublishQueueLength()).toBe(1);
        })
	});

	xdescribe('start', function() {
		it('should throw an error if all the params are not specified', function () {});
		it('should throw an error if all the params are not the correct type', function () {});
		it('should load (require) a widget that corresponds with a channel', function () {});
		it('should call every callback for the channel, within the correct context', function () {});
		it('should trigger a requirejs error if the widget does not exist', function (){});
	});

	xdescribe('stop', function() {
		it('should throw an error if all the params are not specified', function () {});
		it('should throw an error if all the params are not the correct type', function () {});
		it('should call unload with the correct widget to unload from the app', function () {});
		it('should empty the contents of a specific widget\'s container div', function () {});
	});

	// This one will need to be researched a little more to determine exactly what require does
	xdescribe('unload', function () {
		it('should throw an error if all the params are not specified', function () {});
		it('should throw an error if all the params are not the correct type', function () {});
		it('should unload a module and all modules under its widget path', function () {});
	});

});
