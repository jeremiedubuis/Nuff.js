var Presenter = function(extended) {

    var _Constructor = function(options) {

        for (var key in extended) {
            if (typeof extended[key] === 'function') _Constructor.prototype[key] = extended[key];
            else _Constructor[key] = extended[key];
        }

        this._actions = {};


        if (typeof options === 'object' && options.presenterMethods) this.mapViewFunctions(options, options.presenterMethods, options.presenterMethodsScope || this);
        this.init(options);
    };

    _Constructor.prototype= {

        init: function(options) {

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

    return _Constructor;

};

Nuff.Presenter = Presenter;
