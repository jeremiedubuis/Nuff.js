var models = {};
models.Todo = Nuff.Model('Todo', {
    attributes: {
        done: false,
        text: ""
    },

    toggleDone: function() {
        this.set("done", !this.attributes.done);
    }

});

module.exports = models.Todo;
