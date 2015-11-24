var Presenter = function(_extended) {

    var _Constructor = function(options) {

        for (var _key in _extended) {
            if (typeof _extended[_key] === "function") _Constructor.prototype[_key] = _extended[_key];
            else _Constructor[_key] = _extended[_key];
        }

        this._actions = {};


        if (typeof options === "object" && options.presenterMethods) this.mapViewFunctions(options, options.presenterMethods, options.presenterMethodsScope || this);
        this.init(options);
    };

    _Constructor.prototype= {

        init: function(options) {

        },

        mapViewFunctions: function(_view, _functions, scope) {
            var _this = this;

            _functions.forEach(function(fn) {
                if (typeof _this[fn] === "function") {
                    _view[fn] = scope ? _this[fn].bind(scope) : _this[fn] ;
                } else {
                    throw new Error('Presenter->mapViewFunctions() requires an array of functions associated with a view, '+fn+' is not a valid method of presenter instance');
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

    return _Constructor;

};

Nuff.Presenter = Presenter;
