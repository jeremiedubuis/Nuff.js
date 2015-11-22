var Nuff = function() {

    var Nuff = {
        models: []
    };

/**
  * @desc An XMLHttpRequest wrapper
  * @param object {
  *    method (string) : "POST" || "GET" || "PUT" || "UPDATE" || "DELETE"
  *    url (string) : the resource to reach
  *    onSuccess (xhr, response) : success callback
  *    onFailure (xhr) : failure callback
  *    data (string) : parameters
  * }
*/

var ajax = Nuff.ajax = function(object) {

    var _method = object.method.toUpperCase() || "GET";
    var _url = object.url;
    var _onSuccess = object.onSuccess || function() {};
    var _onFailure = object.onFailure || function() {};

    if (_method === "GET" && object.data) {
        _url= _url+"?"+object.data;
        delete object.data;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(_method, _url, true);

    if (object.contentType) {
        xhr.setRequestHeader("Content-type", object.contentType);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4  ) {
        	if ( xhr.status != 200) {
                _onFailure(xhr);
            } else if (xhr.status == 200) {
                _onSuccess(xhr, JSON.parse(xhr.responseText) );
                return true;
            }

            return false;
        }

    };

    xhr.send( object.data );

};

/**
  * @desc An equivalent to jQuery's extend, a mixin function that extends an object with another,
  * @param object1: object to be complemented
  * @param object2: object's properties will be applied to object1
*/
var extend = Nuff.extend = function() {
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

/**
  * @desc An equivalent to jquery's proxy function that allows function creation with specified context and arguments
  * @param  function, [scope, [arguments]]
*/

var proxy = Nuff.proxy = function(fn, context) {
    var args = [].slice.call(arguments, 2);

    return function() {
        return fn.apply(context || this, args.concat([].slice.call(arguments)));
    };
};

// Holds a reference to the registered Dispatcher
var registeredValidator;

/**
  * @desc Validator is a singleton that allows to validate data from RegExp that can be overriden
*/
var Validator = function() {

    if (registeredValidator) return registeredValidator;

    this.regex = {
        alphanumeric : /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+$/,
        numeric: /^\d+$/,
        alpha: /^[a-zA-ZÁÀÂÃÄÉÈËÍÌÎÏÓÒÔÚÙáàãâéèíìîóòúùûü]+$/,
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };

    registeredValidator = this;
};

Validator.prototype = {

    /**
      * @desc  extends regex object with provided object holding RegExp
      * @param object (object)
    */
    set: function(object) {

        for (var key in object) {
            if (!object[key] instanceof RegExp) return false;
        }

        extend(this.regex, object);

        return this;

    },

    /**
      * @desc  validates value using RegExp type defined in regex object or crude RegExp
      * @param type (string || RegExp)
      * @param value (multitype)
    */
    validate: function(type, value) {

        if (this.regex[type])
            return this.regex[type].test(value);
        else if (type instanceof RegExp)
            return type.test(value);
        else
            throw new Error('Validator->validate() requires a regex of a valid check type as parameter and a value');

    }

};

Nuff.Validator = Validator;


// Holds a reference to the registered Dispatcher
var registeredDispatcher;

/**
  * @desc The Dispatcher is a singleton that registers callbacks to be executed on a string dispatch
*/
var Dispatcher = function() {
    if (registeredDispatcher) return registeredDispatcher;
    this.actions = [];
    registeredDispatcher = this;
};

Dispatcher.prototype = {

    /**
      * @desc  Registers a callback to a string, when dispatched callback is fired
      * @param action (string) : the dispatch to which the callback will be bound
      * @param callback (function)
    */
    register: function(action, callback) {

        if (typeof callback !== "function") throw new Error('Dispatcher-> register() requires both string and callback');

        if (!this.actions[action]) this.actions[action] = [callback];
        else this.actions[action].push(callback);

    },

    /**
      * @desc  unregisters a callback that was registered with the register function
      * @param action (string) : the dispatch to which the callback was bound
      * @param callback (function)
    */
    unregister: function(action, callback) {
        if (!this.actions[action]) throw new Error("Dispatcher->"+action+" is undefined");

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
                if (typeof _action === "function") _action();
            });
        }

    },

    /**
      * @desc  A debug function that lists registered callbacks for a given string
      * @param action (string)
    */
    list: function(action) {
        console.log("Dispatcher->"+action+"-> Callbacks :");
        this.actions[action].forEach(function(_action) {
            console.log(_action);
        });
    }

};

Nuff.Dispatcher = Dispatcher;



//methods that will be inherited by various components

/**
  * @desc Dispatches as string so that all associated callbacks are fired
  * @param _action(string)
*/
var _dispatch = function(_action) {

    if (!registeredDispatcher) new Dispatcher();
    registeredDispatcher.dispatch(_action);

};

/**
  * @desc Registers a callback to an action string
  * @param _action(string)
  * @param callback(function)
*/
var _onDispatch = function(_action, callback) {

    if (!registeredDispatcher) {

        registeredDispatcher = new Dispatcher();

    }

    if (!this._actions[_action]) this._actions[_action] = [];

    this._actions[_action].push(callback)
    registeredDispatcher.register(_action, callback);

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

var Router = function() {
    this.routes = [];
    this.eventListeners = [];
};

Router.prototype = {

    register: function(_route, callback, scope, listen) {
        if (_route && typeof callback==="function") {

            if (!this.routes[_route]) {

                this.routes[_route] = {
                    callback: callback,
                    scope: scope || this
                };

                if (listen) this.listen(_route);

                return this;

            } else {
                throw new Error('Router-register() '+_route+' route is already defined');
            }

        } else {
            throw new Error('Router->register() requires a string and a callback function');
        }
    },

    listen: function(_route) {

        var _this = this;

        var _baseRoute = _route.split('/').shift();
        this.eventListeners.push(function() {
            var _hash = window.location.hash.replace('#','');
            if (_hash.split('/').shift() === _baseRoute) {
                _this.setRoute(_hash);
            }
        });
        var _index = this.eventListeners.length-1;
        this.routes[_baseRoute].listenerIndex = _index
        window.addEventListener("hashchange", this.eventListeners[_index]);

    },

    removeListener: function(_route) {
        var _index = this.routes[_route].listenerIndex;
        window.removeEventListener("hashchange", this.eventListeners[_index]);
        this.eventListeners.splice(_index, 1);
    },

    unregister: function(_route) {
        delete this.routes[_route];
        return this;
    },

    setRoute: function(_route, _silent) {

        window.location.hash = _route;
        var _routeParts = _route.split('/');
        _route = _routeParts[0];

        if (!this.routes[_route]) throw new Error('Router->setRoute() '+_route+' is undefined');
        else {

            if (!_silent) {
                this.routes[_route].callback.apply(this.routes[_route].scope, _routeParts);
            }

            return this;

        }
    }

};

Nuff.Router = Router;

/**
  * @desc  Nuff.Model holds data and has data related methods such as get, has or attribute is
           it stores its data in an attributes object andevery model declared is stored in a
           Nuff.models array for checking model instanceof in Collections fo rexample
  * @param name (string): holds the model's name for further reference
  * @param _extended (object): holds data that will extend Model functionnality, all functions
           will be added to object prototype whereas values will be added to object itself
*/
var Model = function (_name, _extended) {

     var _Model = function(_options) {

        for (var _key in _extended) {
            if (typeof _extended[_key] === "function") _Model.prototype[_key] = _extended[_key];
            else _Model[_key] = _extended[_key];
        }

        this._name = _name;
        this._actions = {};
        this.attributes = {};
        this.set(_options);
        this.init();
    };

    _Model.prototype = {

        init: function() {

        },

        /**
          * @desc  extends attributes with an object || sets property by string name
          * @param _data (object || string): _object to extend attributes with or single
                   attribute string identifier
          * @param value (multitype) the value to set for a given attribute string
        */
        set: function(_data) {
            if (typeof _data === "object")
                extend(this.attributes, _data);
            else if (typeof _data === "string" && arguments.length>1) {
                this.attributes[_data] = arguments[1];
            }

            return this.attributes;
        },

        /**
          * @desc  returns single attribute if define or the whole attributes object
          * @param attribute (string)
        */
        get: function(attribute) {
            return attribute ? this.attributes[attribute] : this.attributes;
        },

        /**
          * @desc  Checks if attribute is defined in model
          * @param attribute (string)
        */
        has: function(attribute) {
            return typeof this.attributes[attribute] !== "undefined";
        },

        attributeIs: function(attribute, validatorType) {
            if (!registeredValidator) registeredValidator = new Validator();
            return registeredValidator.validate(validatorType, this.attributes[attribute]);
        },

        /**
          * @desc builds an XMLHTTPRequest and fires onSuccess or onFailure accordingly
          * @param options {
          *    url
          *    method: GET || PUT || POST || UPDATE
          *    onSuccess (xhr, response)
          *    onFailure (xhr)
          *    data: dataString
          * }
        */
        request: function(options) {
            ajax(options);
            return this;
        },

        destroy: function() {

            _removeDispatchListeners();

        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };
    
    Nuff.models[_name] = _Model;

    return _Model;
};
Nuff.Model = Model;

/**
  * @desc  Nuff.Collection is an extended array that holds models and can sort through their
           attributes. The prototype of Array can not be modified therefor Collections instanciate
           single arrays and then apply methods to them (they don't profit from prototype optimization
            for multiple instances)
  * @param _extended (object): holds data and functions that will extend Collection functionnality
                               also holds model string reference for model type checking
*/
var Collection = Nuff.Collection  = function(_extended) {


    var Constructor =function() {

        if (!_extended.model || !Nuff.models[_extended.model]) throw new Error('Collection->model must be a valid Nuff.Model');

        var _Collection = new Array();

        extend (_Collection, _extended)

        /**
          * @desc Returns elements where Model.attributes.attribute is equal to value
                  -> is a private function used in public functions
          * @param attribute (string)
          * @param value
          * @param model (bool) return value (if false or undefined returns id)
        */
        var _getWhere = function(attribute, value, model) {
            var _vals = [];
            for (var i = 0, j = _Collection.length; i<j; ++i) {
                if (_Collection[i].attributes[attribute] === value) _vals.push((model ? _Collection[i] :  i));
            }

            return _vals;
        };

        var _methods = {

            /**
              * @desc overrides the push method to provide model type verifications
            */
            push: function() {
                for (var i = 0, j = arguments.length; i<j; ++i) {
                    if (!arguments[i] instanceof Nuff.models[_extended.model]) throw new Error('Collection->push must provide valid Nuff.Models');
                }
                return Array.prototype.push.apply(this,arguments);
            },

            /**
              * @desc Sorts models in collection by attribute
              * @param attribute string
              * @param order ">" || "<"
            */
            sortBy: function(attribute, order) {
                if (_Collection[0]) {

                    if (typeof _Collection[0].attributes[attribute] === "string") {
                        _Collection.sort(function(a,b) {
                            if(a.attributes[attribute] < b.attributes[attribute]) return -1;
                            if(a.attributes[attribute] > b.attributes[attribute]) return 1;
                            return 0;
                        });
                    } else if ( parseInt(_Collection[0].attributes[attribute]) ) {
                        _Collection.sort(function(a,b) {
                            return a.attributes[attribute] - b.attributes[attribute];
                        });
                    }

                    if (order === "<") return this;
                    else return _Collection.reverse();

                }

                return this;

            },

            /**
              * @desc Returns all models in collection where attribute === value
              * @param attribute (string)
              * @param value
            */
            getWhere: function(attribute, value) {
                return _getWhere(attribute, value, true);
            },

            /**
              * @desc Sets all models in collection where attribute === value
              * @param attribute (string)
              * @param oldvalue
              * @param value
            */
            setWhere: function(attribute, oldValue, value) {

                var _attr = {};
                _attr[attribute] = value;

                //store because foreach returns undefined instead of array
                var _models =_getWhere(attribute, oldValue, true);

                _models.forEach(function(_model) {
                     _model.set(_attr);
                 });

                 return _models;
            },

            /**
              * @desc Deletes all models in collection where attribute === value
              * @param attribute (string)
              * @param value
            */
            deleteWhere: function(attribute, value) {

                if (attribute==="index") {
                    _Collection[value].destroy();
                    _Collection.splice(value, 1);
                } else {
                     _getWhere(attribute, value).forEach(function(val) {
                        _Collection[val].destroy();
                        _Collection.splice(val, 1);
                    });
                }

                return this;

            },

            /**
              * @desc Returns every models' attributes in an array
            */
            toJSON: function() {
                var _json = [];
                _Collection.forEach(function(_model) {
                    _json.push(_model.get());
                });
                return _json;
            },

            dispatch: _dispatch,
            onDispatch: _onDispatch

        };

        extend (_Collection, _methods);

        if (_extended.values) _Collection.push.apply(this, _extended.values);

        return _Collection;
    };

    return Constructor;
};

var Presenter = function(_extended) {
    var Presenter = function(options) {

        for (var _key in _extended) {
            if (typeof _extended[_key] === "function") Presenter.prototype[_key] = _extended[_key];
            else Presenter[_key] = _extended[_key];
        }

        this._actions = {};
        this._instances = [];

        this.init(options);

    };

    Presenter.prototype= {

        init: function(options) {

        },

        mapViewFunctions: function(_view, _functions, scope) {
            var _this = this;
            _functions.forEach(function(fn) {
                if (typeof _this[fn] === "function") {
                    _view[fn] = scope ? _this[fn].bind(scope) : _this[fn] ;
                } else {
                    throw new Error('Presenter->mapViewFunctions() requires an array of functions associated with a view');
                }
            });

            return _view;
        },


        destroy: function() {
            return _removeDispatchListeners();
        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };

    return Presenter;
};
Nuff.Presenter = Presenter;

return Nuff;
}();
