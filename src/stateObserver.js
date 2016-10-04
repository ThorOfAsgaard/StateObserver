/**
 *
 * Extensible State Observer
 * Created by Thor Tallmon - 10/04/2016
 * thor@asgaardianworkshop.com
 * License: MIT
 *
 *
 * USAGE:
 * var stateObserver = new StateObserver();
 * or var stateObserver = require('stateObserver');
 *
 * Best practice is to do processing in the callbacks, so:
 * stateObserver.set({});
 */

// module.exports = function() {

function StateObserver() {
    'use strict';
    this.handlers = [];
}
StateObserver.prototype = {
    /**
     * This, in addition to setState and getState create a simple
     * State-enforcement mechanism, the concept is simple, use this to control states
     * for things that might otherwise be messed up via asynchronous callbacks.
     * This is extensible to track anything you like to.
     *
     * Acceptable types:
     * * Primitives
     * * Methods
     * * Objects
     * @type {{__done: boolean, showing: null, heroScrolling: boolean}}
     * @private
     */

    __state: {},
    __privateState: {
        __done: true
    },
    /**
     * to prevent max stack trace issues for highly asynchronous events
     */
    __callbackLimit: 10,
    /**
     *
     * @param obj json key:value pair
     * @param cb
     * @returns {*}
     */
    set: function (obj, cb, update, num) {
        var self = this;
        if(num && num > self.__callbackLimit) return;
        if (!self.__privateState.__done) {

            if (cb && num < self.__callbackLimit) {
                self.set(obj, cb, null, num+1);
                return;
            }
            return null;
        }
        self.__privateState.__done = false;
        for (var key in obj) {
            self.__state[key] = obj[key];
        }
        // setTimeout(function () {
            self.__privateState.__done = true;
        // }, 1);

        if (cb) {
            cb(self.__state);
            if (update) {
                self.run();
            }
            return;
        }
        if (update) {
            self.run();
        }
        return (self.__state);
    },
    /**
     * Anaphoric function that will return the value of a key
     * IF and ONLY if the done state is true.
     * If state is not done, it will recall itself until it hits __callbackLimit
     * @param key - takes string, array or json object
     * @param cb - optional, but preferred asynchronous method
     * @param num - how many iterations have been called
     * @returns {*}
     */
    get: function (key, cb, num) {
        var returns = {}, self = this;
        if (!self.__privateState.__done) {
            if (cb) {
                if (num && num < self.__callbackLimit) {
                    setTimeout(function() {self.get(key, cb, num + 1)}, 2);
                }
                return (null, true);
            }

            return null;
        }
        if (key.hasOwnProperty("push")) {
            for (var i = 0; i < key.length; i++) {
                returns[key[i]] = self.__state[key[i]];
            }
        } else if (typeof key === "object") {
            for (var k in key) {
                returns[key[k]] = self.__state[key[k]];
            }
        } else {
            returns = (self.__state[key]) ? self.__state[key] : null;
        }

        if (cb) {

            cb(returns);
        }
        return self.__state[returns];
    },
    /**
     * Deletes a key from the state object, returns updated object
     * @param key
     * @param cb
     */
    del: function (key, cb) {
        var self = this;
        if (!self.__privateState.__done) {
            return null;
        }
        delete(self.__state[key]);
        if (cb) {
            cb(self.__state);
            return;
        }
        return self.__state;

    },
    /**
     * runs all the subscribed handlers
     */
    run: function () {
        var self = this;
        console.log(self.handlers);
        for (x in self.handlers) {
            self.handlers[x]();
        }
    },
    subscribe: function (fn) {
        this.handlers.push(fn);
    },
    unsubscribe: function (fn) {
        this.handlers = this.handlers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }
};

if (typeof module !== "undefined") {
    module.exports = new StateObserver();
}
