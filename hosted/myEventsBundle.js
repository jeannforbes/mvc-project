'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var oppRenderer = void 0;
var oppForm = void 0;
var OppFormClass = void 0;
var OppListClass = void 0;

var handleDeleteOpp = function handleDeleteOpp(e) {
	e.preventDefault();

	sendAjax('POST', $(e.target).attr('action'), $(e.target).serialize(), function () {
		oppRenderer.loadMyOpps();
	});

	return false;
};

var renderOpp = function renderOpp() {
	return React.createElement(
		'div',
		{ id: 'oppFormContainer' },
		React.createElement(
			'form',
			{ id: 'oppForm',
				onSubmit: this.handleSubmit,
				name: 'oppForm',
				action: '/maker',
				method: 'POST',
				className: 'oppForm'
			},
			React.createElement(
				'h3',
				{ htmlFor: 'oppName' },
				'Event Name '
			),
			React.createElement('input', { id: 'oppName', type: 'text', name: 'name', placeholder: 'event title here' }),
			React.createElement(
				'h3',
				{ htmlFor: 'oppDate' },
				'Date '
			),
			React.createElement('input', { id: 'oppDate', type: 'date', name: 'date' }),
			React.createElement(
				'h3',
				{ htmlFor: 'oppInfo' },
				'Description '
			),
			React.createElement('textarea', { id: 'oppInfo', type: 'text', name: 'info' }),
			React.createElement(
				'h3',
				{ htmlFor: 'oppContact' },
				'Contact Information '
			),
			React.createElement(
				'label',
				{ htmlFor: 'oppEmail' },
				'Email: '
			),
			React.createElement('input', { id: 'oppEmail', type: 'email', name: 'email', placeholder: 'me@example.com' }),
			React.createElement(
				'label',
				{ htmlFor: 'oppPhone' },
				'Phone: '
			),
			React.createElement('input', { id: 'oppPhone', type: 'tel', name: 'phone', placeholder: '(xxx)xxx-xxxx' }),
			React.createElement(
				'label',
				{ htmlFor: 'oppContactOther' },
				'Other: '
			),
			React.createElement('textarea', { id: 'oppContactOther', name: 'other' }),
			React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
			React.createElement('input', { className: 'makeOppSubmit', type: 'submit', value: 'Make Event' })
		)
	);
};

var renderOppList = function renderOppList() {
	if (this.state.data.length === 0) {
		return React.createElement(
			'div', null,
			React.createElement(
				'div', { className: 'oppList' },
				React.createElement(
					'h3', { className: 'emptyOpp' }, 'No events match this filter'
				)
			)
		);
	}

	var oppNodes = this.state.data.map(function (opp) {
		var _React$createElement;

		var date = new Date(opp.date);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dt = date.getDate() + 1;

		return React.createElement(
			'div', { key: opp._id, className: 'opp' },
			React.createElement( 'h2', { className: 'oppName' }, opp.name),
			React.createElement( 'h3', null, 'Date'),
			React.createElement( 'p', { className: 'oppDate' }, month,'-',dt,'-', year ),
			React.createElement( 'h3', null, 'Info' ),
			React.createElement( 'p', { className: 'oppInfo' }, opp.info),
			React.createElement( 'h3', null, 'Contact'),
			React.createElement(
				'div', { className: 'contactInfo' },
				React.createElement( 'p', { className: 'oppEmail' }, opp.email),
				React.createElement( 'p', { className: 'oppPhone' }, opp.phone),
				React.createElement( 'p', { className: 'oppOther' }, opp.other)
			),
			React.createElement(
				'form',
				(_React$createElement = {
					className: 'deleteForm'
				}, 
				 _defineProperty(_React$createElement, 'className', 'oppForm'),
				 _defineProperty(_React$createElement, 'onSubmit', this.handleDelete),
				 _defineProperty(_React$createElement, 'name', 'responseForm'),
				 _defineProperty(_React$createElement, 'action', '/delete'),
				 _defineProperty(_React$createElement, 'method', 'POST'),
				 _React$createElement),

				React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
				React.createElement('input', { type: 'hidden', name: 'uniqueId', value: opp.uniqueId }),
				React.createElement('input', { className: 'oppDelete', type: 'submit', value: 'Delete' })
			),
			React.createElement(
				'div',
				{className: 'myOppData'},
				React.createElement( 'p', { className: 'numRSVPs' }, "RSVPS: " + opp.rsvps.length),
				React.createElement( 'p', { className: 'numBookmarks' }, "Bookmarks: " + opp.bookmarks.length)
			)
		);
	}.bind(this));

	return React.createElement(
		'div',
		null,
		React.createElement(
			'div',
			{ className: 'oppList' },
			oppNodes
		)
	);
};

var setup = function setup(csrf) {
	OppListClass = React.createClass({
		displayName: 'OppListClass',

		loadMyOpps: function loadMyOpps() {
			sendAjax('GET', '/getMyOpps', null, function (data) {
				this.setState({ data: data.opps });
			}.bind(this));
		},
		selectButton: function selectButton(buttonId){
			buttonSelect(buttonId);
		},
		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			this.loadMyOpps();
		},
		render: renderOppList,
		handleDelete: handleDeleteOpp,
	});

	oppRenderer = ReactDOM.render(React.createElement(OppListClass, { csrf: csrf }), document.querySelector('#opps'));
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
	$("#errorMessage").animate({
		opacity: 1
	}, 500);
	$("#errorMessage").animate({
		opacity: 0
	}, 3000);
};

var redirect = function redirect(response) {
	window.location = response.redirect;
};

var buttonSelect = function buttonSelect(buttonId){
	var buttons = document.getElementsByTagName('button');
	for(var i=0; i<buttons.length; i++){
		buttons[i].className = '';
	}
	document.getElementById(buttonId).className = 'selected';
}

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
