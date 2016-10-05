/**
 * Created by C14502 on 10/4/2016.
 */
// var jQuery = require('../node_modules/jquery/dist/jquery.min');
// var $ = jQuery;
$(function () {

    $.getScript('../src/StateObserver.js');
    QUnit.module("StateObserver");

    QUnit.test("Setting and Deleting State Properties", function (assert) {
        var s = new StateObserver();
        var obj = {sampleState: true, sampleInt: 10}
        var arr = [0, 1, 8675309, 5];
        var ret = "This is a sample state function";
        var f = function () {
            return ret;
        };
        s.set({
            stateBoolean: true,
            stateString: "This is a sample string",
            stateArray: arr,
            stateFunction: f,
            stateObject: obj
        }, function (res) {
            assert.equal(res.stateBoolean, true, "Was able to set a boolean in a state");
            assert.equal(res.stateString, "This is a sample string", "Was able to set a string in a state");
            assert.equal(res.stateArray[2], 8675309, "Was able to set an array in a state");
            assert.equal(res.stateFunction(), ret, "Was able to set a function in state, and get the result");
            assert.equal(res.stateObject, obj, "Was able to set an object in state and verify it's contents");
        });
        s.del("stateArray", function(res) {
           s.get("stateArray", function(r) {
              assert.equal(r, null, "Deleted element from state");
           });
        });
    });

    QUnit.test("Modifying State Properties", function (assert) {
        s = new StateObserver();
        s.set({testProperty: true}, function (res) {
            assert.equal(res.testProperty, true, "First property set properly")
            s.set({testProperty: 8000}, function (res) {
                assert.equal(res.testProperty, 8000, "Property successfully mutated to integer");
                s.set({testProperty: "foo"}, function (res) {
                    assert.equal(res.testProperty, "foo", "Property successfully mutated to a string");
                    s.set({
                        testProperty: function () {
                            return "This is a test function"
                        }
                    }, function (res) {
                        assert.equal(res.testProperty(), "This is a test function", "Property successfully mutated to a function");

                    });
                });
            })
        });
    });

    QUnit.test("Subscribing and Unsubscribing", function (assert) {
        var s = new StateObserver();
        var handler = function () {
            s.get("testProperty", function (res) {
                assert.equal(res(), "BOOM!", "Observer triggered and gave correct result");
            });
            return "BANG!"
        };
        s.subscribe(handler);
        s.set({
            testProperty: function () {
                return "BOOM!"
            }
        }, function (res) {

        }, true);
        s.unsubscribe(handler);
        s.set({testProperty: "foo"}, function (res) {
            assert.equal(s.handlers.length, 0, "Unsubscribed handler");
        }, true);
    });
   //TODO: should probably have some more robust tests to handle the async stuff
    QUnit.test("Asynchronous Tests", function(assert) {
        var done = assert.async();
        var s = new StateObserver();
        var i =0;
        s.set({asyncTest: i}, function(r) {
            i++;
            s.get("asyncTest", function(res) {
            });
        });

        var x = setInterval(function() {
            s.set({asyncTest: i}, function(r) {
               i++;
                s.get("asyncTest", function(res) {
                    if(i==10) {
                        assert.equal(res, i-1, "Value correct in callback");
                        done();
                        clearInterval(x);

                    }
                });
            });
        }, 1);

        s.get("asyncText", function(res) {
            assert.equal(res, null, "Value null before actually set");
        });

    });
});