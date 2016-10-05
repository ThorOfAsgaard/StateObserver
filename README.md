# StateObserver

## An Extensible State Observer to help manage sanity
#### Author: Thor Tallmon
#### Email: thor@asgaardianworkshop.com
#### License: MIT

##Basic Usage:
Initialization:

    var stateObserver = new StateObserver();
    var stateObserver = require('stateObserver');

Best Practice is to do most logic within the callback functions of set/get:

    stateObserver.set({key: value}, function(res) {
            //Do something here
    
    });
    stateObserver.get("key", function(res) {
            //Do something with here with res.
    
    });
    
    
You CAN use this synchronously, but *caveat emptor*, cuz Javascript

    var x = stateObserver.get("key");
   
IF the done flag is true, then it **should** return the appropriate value, but due to the asynchronous nature of web-applications, it is generally better to use the callback method described prior.  Don't be lazy.


## Observer pattern
If you're building a rather complex web-app, sometimes you need to be able to update a bunch of object, methods, etc. all at once - fortunately, you can register any method as a handler for the StateObserver:

    var func = function() {console.log("doing something cool");}
    stateObserver.subscribe(func);
    
Once a handler is subscribed, you can then have it run when setting the state by passing in 'true' at the end:
    
    stateObserver.set({key: value}, function(ret){ //Do something asyncronousely}, true);
    
You can unsubscribe in similar fashion so subscribing:

    stateObserver.unsubscribe(func);
    
    
    