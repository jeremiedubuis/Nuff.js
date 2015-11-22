var presenter = require('../presenters/todo.js');

var Todos = React.createClass({

    getInitialState: function() {
        return {
            list: [],
            presenter: new presenter(this)
        };
    },

    render: function() {
        var _this = this;

        return <div className="todos">

            <input type="text" ref="textInput" class="add" onKeyUp={this.onKeyUp.bind(this)} /><button onClick={this.onAddClick}>Add</button>
            <ul>
                {
                    this.state.list.map(function(_todo, i) {
                        return <li>
                            <input type="checkbox"
                                onClick={_this.taskDone.bind(_this, i )} checked={_todo.done ? true : false} />

                            <label> {_todo.text} </label>
                            <button
                                onClick={_this.delete.bind(_this, i)}>
                                Delete</button>
                        </li>
                    })
                }
            </ul>
            <button class="clear"
                onClick={_this.deleteDone}>
                Clear done</button>
        </div>

    },
    onKeyUp: function(e,a) {
        if (e.which === 13) this.onAddClick();
    },
    onAddClick: function() {
        var _value = this.refs.textInput.value;
        if (_value.length>0)
        this.add(_value);
        this.refs.textInput.value= "";
        this.refs.textInput.focus();
    }

});

module.exports = Todos;
