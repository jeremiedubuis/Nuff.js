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
