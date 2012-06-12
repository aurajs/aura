describe("Mediator", function () {

    var mediator,
        channels,
        TEST_CHANNEL = "test";

    beforeEach(function() {
        mediator = window.core;
        channels = mediator._getChannels();

        expect(mediator).toBeDefined();
        expect(channels).toBeDefined();

        delete channels[TEST_CHANNEL]; //clean our test channel
    });

    describe("subscribe", function() {
        it("should allow an event to be subscribed", function() {
            mediator.subscribe(TEST_CHANNEL, function() {}, this);

            expect(channels[TEST_CHANNEL]).toBeDefined();
        })

        it("should be able assign a specific callback for subscribed event", function() {
            var callback,
                callbackResult = "callback";
            mediator.subscribe(TEST_CHANNEL, function() { return callbackResult }, this);
            callback = channels[TEST_CHANNEL][0];

            expect(callback()).toBe(callbackResult);
        })
    });
});