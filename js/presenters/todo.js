var TodoModel = require('../models/Todo.js');
var TodosCollection = require('../collections/Todos.js');

var TodoPresenter = Nuff.Presenter('Todo', {
    init: function(view) {

        var _this = this;
        this.view = view;
        this.list = new TodosCollection();

        this.onDispatch('todoList:update', function() {
            _this.view.setState({list: _this.list.toJSON() });
        });

    },

    add: function(_text) {

        this.list.push(
            new TodoModel({
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

    clearDone: function() {

        this.list.deleteWhere('done', true);
        this.dispatch("todoList:update");
    }

});

module.exports = TodoPresenter;
