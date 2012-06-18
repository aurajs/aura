describe("Mediator", function () {

    var mediator,
        channels,
        TEST_CHANNEL = "test";

    beforeEach(function() {
        mediator = window.core;
        channels = mediator.getChannels();

        expect(mediator).toBeDefined();
        expect(channels).toBeDefined();

        delete channels[TEST_CHANNEL]; //clean our test channel
    });

    describe("subscribe", function() {

        beforeEach(function() {
            //override method util as it uses jQuery proxy and doesn't
            //allow comparison of actual callback function object.
            mediator.util.method = function(fn, context) {
                return fn;
            };
        });

        it("Should throw an error if all the params aren't specified", function () {
            expect(function() {
                mediator.subscribe();
            }).toThrow(new Error("Channel, callback, and context must be defined"))
        });

        // TODO: Type checking, validation

        it("should allow an event to be subscribed", function() {
            mediator.subscribe(TEST_CHANNEL, function() {}, this);
            expect(channels[TEST_CHANNEL]).toBeDefined();
        });

        it("should be able assign a specific callback for subscribed event", function() {
            var callback,
                callbackResult = "callback";
            mediator.subscribe(TEST_CHANNEL, function() { return callbackResult }, this);
            callback = channels[TEST_CHANNEL][0];
            expect(callback()).toBe(callbackResult);
        });

        it("should allow subscribing multiple callbacks for single event channel", function() {
            var callback1 = function() {};
            var callback2 = function() {};

            mediator.subscribe(TEST_CHANNEL, callback1, this);
            mediator.subscribe(TEST_CHANNEL, callback2, this);

            expect(channels[TEST_CHANNEL]).toContain(callback1, callback2);
        });
    });

    describe("publish", function() {
        it("Should throw an error if all the params aren't specified", function () {});
        it("Should throw an error if all the params aren't the correct type", function () {});
        it("Should call every callback for a channel, within the correct context", function () {});
        it("Should pass additional arguments to every call callback for a channel", function () {});
        it("Should call the start method if the channel has not been defined", function () {});
    });

    describe("start", function() {
        it("Should throw an error if all the params aren't specified", function () {});
        it("Should throw an error if all the params aren't the correct type", function () {});
        it("Should load (require) a widget that corresponds with a channel", function () {});
        it("Should call every callback for the channel, within the correct context", function () {});
        it("Should trigger a requirejs error if the widget doesn't exist", function (){});
    });

    describe("stop", function() {
        it("Should throw an error if all the params aren't specified", function () {});
        it("Should throw an error if all the params aren't the correct type", function () {});
        it("Should call unload with the correct widget to unload from the app", function () {});
        it("Should empty the contents of a specific widget's container div", function () {});
    });

    // This one will need to be researched a little more to determine exactly what require does
    describe("unload", function () {
        it("Should throw an error if all the params aren't specified", function () {});
        it("Should throw an error if all the params aren't the correct type", function () {});
        it("Should unload a module and all modules under its widget path", function () {});
    });
});