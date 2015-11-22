
var model = require('../models/Todo.js');
var collection = require('../collections/Todos.js');

var presenters = {};

presenters.todo = Nuff.Presenter({

    init: function(view) {

        var _this = this;
        this.view = view;
        this.list = new collection();

        // Binds presenter functions to view actions
        this.mapViewFunctions(view,
            ["taskDone", "add", "delete", "deleteDone"]
        , this);

        this.onDispatch('todoList:update', function() {
            _this.view.setState({list: _this.list.toJSON() });
        });

    },

    add: function(_text) {

        this.list.push(
            new model({
                text: _text
            })
        );
        this.dispatch("todoList:update");
    },

    taskDone: function(_id) {
        this.list[_id].toggleDone();
        this.dispatch("todoList:update");
    },

    delete: function(_id) {
        this.list[_id].destroy();
        this.list.splice(_id,1);
        this.dispatch("todoList:update");
    },

    deleteDone: function() {

        this.list.deleteWhere('done', true);
        this.dispatch("todoList:update");
    }

});

module.exports = presenters.todo;
