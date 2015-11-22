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
