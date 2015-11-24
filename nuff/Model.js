/**
  * @desc  Nuff.Model holds data and has data related methods such as get, has or attribute is
           it stores its data in an attributes object andevery model declared is stored in a
           Nuff.models array for checking model instanceof in Collections fo rexample
  * @param name (string): holds the model's name for further reference
  * @param extended (object): holds data that will extend Model functionnality, all functions
           will be added to object prototype whereas values will be added to object itself
*/
var Model = function (name, extended) {

     var _Constructor = function(_options) {

        for (var key in extended) {
            if (typeof extended[key] === 'function') _Constructor.prototype[key] = extended[key];
            else _Constructor[key] = extended[key];
        }

        this.name = name;
        this._actions = {};
        this.attributes = {};
        this.set(_options);
        this.init();
    };

    _Constructor.prototype = {

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

    Nuff.models[name] = _Constructor;

    return _Constructor;

};

Nuff.Model = Model;
