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
