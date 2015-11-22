var todosView = require('./views/Todos.jsx');

React.render(
	React.createElement(todosView, null),
	document.getElementById('todos-wrapper')
);
