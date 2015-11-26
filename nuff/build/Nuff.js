/**
  * @desc Nuff.js is a simple Model Presenter framework to structure your JS code
  * @version 0.1.0
  * @author Jérémie Dubuis jeremie.dubuis@gmail.com
  * @license The MIT License (MIT)
*/
var Nuff = function() {

    var Nuff = {
        models: [],
        presenterInstances: []
    };

/**
  * @desc An XMLHttpRequest wrapper
  * @param object {
  *    method (string) : 'POST' || 'GET' || 'PUT' || 'UPDATE' || 'DELETE'
  *    url (string) : the resource to reach
  *    onSuccess (xhr, response) : success callback
  *    onFailure (xhr) : failure callback
  *    data (string) : parameters
  * }
*/

var ajax = Nuff.ajax = function(object) {

    var _method = object.method.toUpperCase() || 'GET';
    var _url = object.url;
    var _onSuccess = object.onSuccess || function() {};
    var _onFailure = object.onFailure || function() {};

    if (_method === 'GET' && object.data) {
        _url= _url+'?'+object.data;
        delete object.data;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(_method, _url, true);

    if (object.contentType) {
        xhr.setRequestHeader('Content-type', object.contentType);
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


/**
  * @desc Validator is a singleton that allows to validate data from RegExp that can be overriden
*/
var Validator = function() {

    this.regex = {
        alphanumeric : /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+$/,
        numeric: /^\d+$/,
        alpha: /^[a-zA-ZÁÀÂÃÄÉÈËÍÌÎÏÓÒÔÚÙáàãâéèíìîóòúùûü]+$/,
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
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

// Holds a reference to the registered Dispatcher
var registeredValidator;

Nuff.Validator = function() {

    if (!registeredValidator) registeredValidator = new Validator();

    return registeredValidator;

};


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

var Router = function() {
    this.routes = [];
    this.eventListeners = [];
};

Router.prototype = {

    register: function(route, callback, scope, listen) {
        if (route && typeof callback==='function') {

            if (!this.routes[route]) {

                this.routes[route] = {
                    callback: callback,
                    scope: scope || this
                };

                if (listen) this.listen(route);

                return this;

            } else {
                throw new Error('Router-register() '+route+' route is already defined');
            }

        } else {
            throw new Error('Router->register() requires a string and a callback function');
        }
    },

    listen: function(route) {

        var _this = this;

        var _baseRoute = route.split('/').shift();
        this.eventListeners.push(function() {
            var _hash = window.location.hash.replace('#','');
            if (_hash.split('/').shift() === _baseRoute) {
                _this.setRoute(_hash);
            }
        });
        var _index = this.eventListeners.length-1;
        this.routes[_baseRoute].listenerIndex = _index
        window.addEventListener('hashchange', this.eventListeners[_index]);

    },

    removeListener: function(route) {
        var _index = this.routes[route].listenerIndex;
        window.removeEventListener('hashchange', this.eventListeners[_index]);
        this.eventListeners.splice(_index, 1);
    },

    unregister: function(route) {
        delete this.routes[route];
        return this;
    },

    setRoute: function(route, _silent) {

        window.location.hash = route;
        var routeParts = route.split('/');
        route = routeParts[0];

        if (!this.routes[route]) throw new Error('Router->setRoute() '+route+' is undefined');
        else {

            if (!_silent) {
                this.routes[route].callback.apply(this.routes[route].scope, routeParts);
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
  * @param extended (object): holds data that will extend Model functionnality, all functions
           will be added to object prototype whereas values will be added to object itself
*/
var Model = function (name, extended) {

     var Model = function(_options) {

        for (var key in extended) {
            if (typeof extended[key] === 'function') Model.prototype[key] = extended[key];
            else Model[key] = extended[key];
        }

        this.name = name;
        this._actions = {};
        this.attributes = {};
        this.set(_options);
        this.init();
    };

    Model.prototype = {

        init: function() {

        },

        /**
          * @desc  extends attributes with an object || sets property by string name
          * @param _data (object || string): _object to extend attributes with or single
                   attribute string identifier
          * @param value (multitype) the value to set for a given attribute string
        */
        set: function(_data) {
            if (typeof _data === 'object')
                extend(this.attributes, _data);
            else if (typeof _data === 'string' && arguments.length>1) {
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
            return typeof this.attributes[attribute] !== 'undefined';
        },

        attributeIs: function(attribute, validatorType) {
            var _validator = Nuff.Validator();
            return _validator.validate(validatorType, this.attributes[attribute]);
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

    Nuff.models[name] = Model;

    return Model;

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
var Collection = Nuff.Collection  = function(extended) {


    var Collection = function() {

        if (!extended.model || !Nuff.models[extended.model]) throw new Error('Collection->model must be a valid Nuff.Model');

        var _Collection = new Array();

        extend (_Collection, extended)

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
                    if (!arguments[i] instanceof Nuff.models[extended.model]) throw new Error('Collection->push must provide valid Nuff.Models');
                }
                return Array.prototype.push.apply(this,arguments);
            },

            /**
              * @desc Sorts models in collection by attribute
              * @param attribute string
              * @param order '>' || '<'
            */
            sortBy: function(attribute, order) {
                if (_Collection[0]) {

                    if (typeof _Collection[0].attributes[attribute] === 'string') {
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

                    if (order === '<') return this;
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
              * @desc Sets all models 'attributeToset' to 'value' in collection where 'attribute' === 'oldValue'
              * @param attribute (string)
              * @param oldvalue
              * @param attributeToSet (string)
              * @param value
            */
            setWhere: function(attribute, oldValue, attributeToSet, value) {


                if (typeof value === 'undefined') {
                    value = attributeToSet;
                    attributeToSet = attribute;
                }


                //store because foreach returns undefined instead of array
                var _models =_getWhere(attribute, oldValue, true);

                _models.forEach(function(_model) {
                     _model.set(attributeToSet, value);
                 });

                 return _models;
            },

            /**
              * @desc Deletes all models in collection where attribute === value
              * @param attribute (string)
              * @param value
            */
            deleteWhere: function(attribute, value) {

                if (attribute==='index') {
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
                _Collection.forEach(function(model) {
                    _json.push(model.get());
                });
                return _json;
            },

            dispatch: _dispatch,
            onDispatch: _onDispatch

        };

        extend (_Collection, _methods);

        if (extended.values) _Collection.push.apply(this, extended.values);

        return _Collection;

    };

    return Collection;
};

var Presenter = function(name, extended) {



    var Presenter = function(options) {


        for (var key in extended) {
            if (typeof extended[key] === 'function') Presenter.prototype[key] = extended[key];
            else Presenter[key] = extended[key];
        }

        this.presenterName = name;
        Nuff.presenterInstances[name] = this;

        this._actions = {};
        this._init(options);

    };

    Presenter.prototype= {

        _init: function(options) {
            this.destroy();
            if (typeof options === 'object' && options.presenterMethods) this.bindMethodsToView(options, options.presenterMethods);
            this.init(options);
            return this;
        },

        init: function(options) {

        },

        bindMethodsToView: function(view, presenterMethods) {
            if (view)
                this.mapViewFunctions(view, presenterMethods, view.presenterMethodsScope || this);

            return this;
        },

        mapViewFunctions: function(view, functions, scope) {
            var _this = this;

            functions.forEach(function(fn) {
                if (typeof _this[fn] === 'function') {
                    view[fn] = scope ? _this[fn].bind(scope) : _this[fn] ;
                } else {
                    throw new Error('Presenter->mapViewFunctions() requires an array of functions associated with a view, '+fn+' is not a valid method of presenter instance');
                }
            });

            return view;
        },


        destroy: function() {
            return _removeDispatchListeners();
        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };


    if (extended && typeof extended.singleton !== "undefined" && !extended.singleton)
        return Presenter;
    else return function(options) {
        if (!Nuff.presenterInstances[name]) {
            return new Presenter(options);
        } else {
            return Nuff.presenterInstances[name]._init(options);
        }
    };

};

Nuff.Presenter = Presenter;

return Nuff;
}();
