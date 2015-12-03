
// Holds a reference to the registered Dispatcher
var registeredDispatcher;

/**
  * @desc The Dispatcher is a singleton that registers callbacks to be executed on a string dispatch
*/
var Dispatcher = function() {
    this.actions = [];
};

Dispatcher.prototype = {

    /**
      * @desc  Registers a callback to a string, when dispatched callback is fired
      * @param action (string) : the dispatch to which the callback will be bound
      * @param callback (function)
      * @param scope (object) : callback scope
    */
    register: function(action, callback, scope) {

        if (typeof callback !== 'function') throw new Error('Dispatcher-> register() requires both string and callback');

        if (!this.actions[action]) this.actions[action] = [{
            scope: scope,
            callback: callback
        }];
        else this.actions[action].push({
            scope: scope,
            callback: callback
        });

    },

    /**
      * @desc  unregisters a callback that was registered with the register function
      * @param action (string) : the dispatch to which the callback was bound
      * @param callback (function)
    */
    unregister: function(action, callback) {
        if (!this.actions[action]) throw new Error('Dispatcher->'+action+' is undefined');

        if (!callback) this.actions[action] = [];

        var _index = this.actions[action].indexOf(callback);
        if (_index > -1) this.actions[action].splice(_index,1);
    },

    /**
      * @desc  Fires every  registered callbacks associated with a string
      * @param action (string) : the dispatch key to trigger on
      * @param object (object) :an object that will be passed as a paramater to the callback
    */
    dispatch: function(action, object) {

        if (this.actions[action]) {
            this.actions[action].forEach(function(_action) {
                if (typeof _action.callback === 'function') {
                    if (_action.scope) _action.callback.bind(_action.scope, object);
                    else _action.callback(object);
                }
            });
        }

    },

    /**
      * @desc  A debug function that lists registered callbacks for a given string
      * @param action (string)
    */
    list: function(action) {
        console.log('Dispatcher->'+action+'-> Callbacks :');
        this.actions[action].forEach(function(_action) {
            console.log(_action.callback);
        });
    }

};

Nuff.Dispatcher = function() {
    if (!registeredDispatcher) registeredDispatcher = new Dispatcher();
    return registeredDispatcher;
};



//methods that will be inherited by various components

/**
  * @desc Dispatches as string so that all associated callbacks are fired
  * @param _action(string)
*/
var _dispatch = function(_action, object) {
    Nuff.Dispatcher().dispatch(_action, object);

};

/**
  * @desc Registers a callback to an action string
  * @param _action(string)
  * @param callback(function)
*/
var _onDispatch = function(_action, callback, scope) {

    if (!this._actions[_action]) this._actions[_action] = [];

    this._actions[_action].push({
        scope: scope,
        callback: callback
    });
    Nuff.Dispatcher().register(_action, callback, scope);

    return this;

};

/**
  * @desc Unregisters all dispatch callbacks associated to a model, collection or presenter
  * @param _action(string)
  * @param callback(function)
*/
var _removeDispatchListeners = function() {
    if (registeredDispatcher) {

        for (_key in this._actions) {

            this._actions[_key].forEach(function(callback) {
                registeredDispatcher.unregister(_key, callback);
            });

        }

        return true;

    } else {

        return false;

    }
};
