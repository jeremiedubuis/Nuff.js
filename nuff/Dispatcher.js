
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
    */
    register: function(action, callback) {

        if (typeof callback !== 'function') throw new Error('Dispatcher-> register() requires both string and callback');

        if (!this.actions[action]) this.actions[action] = [callback];
        else this.actions[action].push(callback);

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
    */
    dispatch: function(action) {

        if (this.actions[action]) {
            this.actions[action].forEach(function(_action) {
                if (typeof _action === 'function') _action();
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
            console.log(_action);
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
var _dispatch = function(_action) {
    Nuff.Dispatcher().dispatch(_action);

};

/**
  * @desc Registers a callback to an action string
  * @param _action(string)
  * @param callback(function)
*/
var _onDispatch = function(_action, callback) {

    if (!this._actions[_action]) this._actions[_action] = [];

    this._actions[_action].push(callback)
    Nuff.Dispatcher().register(_action, callback);

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
