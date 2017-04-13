'use strict';

var domoRenderer = void 0;
var domoForm = void 0;
var DomoFormClass = void 0;
var DomoListClass = void 0;

var handleDomo = function handleDomo(e) {
	e.preventDefault();

	$('#domoMessage').animate({ width: 'hide' }, 350);

	if ($('#domoName').val == '' || $('#domoAge').val() == '') {
		handleError('RAWR!  All fields are required');
		return false;
	}

	sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
		domoRenderer.loadDomosFromServer();
	});

	return false;
};

var renderDomo = function renderDomo() {
	return React.createElement(
		'form',
		{ id: 'domoForm',
			onSubmit: this.handleSubmit,
			name: 'domoForm',
			action: '/maker',
			method: 'POST',
			className: 'domoForm'
		},
		React.createElement(
			'label',
			{ htmlFor: 'name' },
			'Name: '
		),
		React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'ex. Johnny Sly' }),
		React.createElement(
			'label',
			{ htmlFor: 'title' },
			'Title: '
		),
		React.createElement('input', { id: 'domoTitle', type: 'text', name: 'title', placeholder: 'ex. The Pernicious' }),
		React.createElement(
			'label',
			{ htmlFor: 'class' },
			'Class: '
		),
		React.createElement(
			'select',
			{ id: 'domoClass', type: 'text', name: 'class', defaultValue: 'Vagrant' },
			React.createElement(
				'option',
				{ value: 'Vagrant' },
				'Vagrant'
			),
			React.createElement(
				'option',
				{ value: 'Scavenger' },
				'Scavenger'
			),
			React.createElement(
				'option',
				{ value: 'Drifter' },
				'Drifter'
			)
		),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
		React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
	);
};

var renderDomoList = function renderDomoList() {
	if (this.state.data.length === 0) {
		return React.createElement(
			'div',
			{ className: 'domoList' },
			React.createElement(
				'h3',
				{ className: 'emptyDomo' },
				'No Domos yet'
			)
		);
	}

	var domoNodes = this.state.data.map(function (domo) {
		console.dir(domo);
		return React.createElement(
			'form',
			{ key: domo._id, className: 'domo',
				onSubmit: this.handleSubmit,
				name: 'AdventureForm',
				action: '/adventure',
				method: 'POST'
			},
			React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domoface', className: 'domoFace' }),
			React.createElement(
				'h3',
				{ className: 'domoName' },
				domo.name,
				' ',
				domo.title
			),
			React.createElement(
				'h3',
				{ className: 'domoStat' },
				'Class: ',
				domo.class
			),
			React.createElement(
				'h3',
				{ className: 'domoStat' },
				'Cunning: ',
				domo.stats.cunning
			),
			React.createElement(
				'h3',
				{ className: 'domoStat' },
				'Fortitude: ',
				domo.stats.fortitude
			),
			React.createElement(
				'h3',
				{ className: 'domoStat' },
				'Treachery: ',
				domo.stats.treachery
			),
			React.createElement(
				'h3',
				{ className: 'domoStat' },
				'HP: ',
				domo.stats.hp
			),
			React.createElement('input', { className: 'makeDomoAdventure', type: 'submit', value: 'ADVENTURE!' })
		);
	});

	return React.createElement(
		'div',
		{ className: 'domoList' },
		domoNodes
	);
};

var setup = function setup(csrf) {
	DomoFormClass = React.createClass({
		displayName: 'DomoFormClass',

		handleSubmit: handleDomo,
		render: renderDomo
	});

	DomoListClass = React.createClass({
		displayName: 'DomoListClass',

		loadDomosFromServer: function loadDomosFromServer() {
			sendAjax('GET', '/getDomos', null, function (data) {
				this.setState({ data: data.domos });
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			this.loadDomosFromServer();
		},
		render: renderDomoList
	});

	domoForm = ReactDOM.render(React.createElement(DomoFormClass, { csrf: csrf }), document.querySelector('#makeDomo'));

	domoRenderer = ReactDOM.render(React.createElement(DomoListClass, null), document.querySelector('#domos'));
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
