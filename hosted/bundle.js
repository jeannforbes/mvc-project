'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var oppRenderer = void 0;
var oppForm = void 0;
var OppFormClass = void 0;
var OppListClass = void 0;

var handleMakeOpp = function handleMakeOpp(e) {
	e.preventDefault();

	$('#oppMessage').animate({ width: 'hide' }, 350);

	if ($('#oppName').val == '' || $('#oppDate').val() == '' || $('#oppInfo').val() == '') {
		handleError('Event name, date and description are required.');
		return false;
	}

	sendAjax('POST', $('#oppForm').attr('action'), $('#oppForm').serialize(), function () {
		oppRenderer.loadOppsFromServer();
	});

	return false;
};

var handleRSVPOpp = function handleRSVPOpp(e) {
	e.preventDefault();

	e.target.querySelector('.oppRespond').innerHTML = 'RSVPed!';

	sendAjax('POST', $(e.target).attr('action'), $(e.target).serialize(), function () {});

	return false;
};

var handleBookmarkOpp = function handleBookmarkOpp(e) {
	e.preventDefault();

	e.target.querySelector('.oppBookmark').innerHTML = 'Bookmarked!';

	sendAjax('POST', $(e.target).attr('action'), $(e.target).serialize(), function () {});

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
			'div',
			null,
			React.createElement(
				'div',
				{ id: 'filters' },
				'FILTERS',
				React.createElement(
					'button',
					{ onClick: this.loadOppsFromServer },
					'None'
				),
				React.createElement(
					'button',
					{ onClick: this.loadOppsByBookmark },
					'Bookmarks'
				),
				React.createElement(
					'button',
					{ onClick: this.loadOppsByRSVP },
					'RSVPs'
				)
			),
			React.createElement(
				'div',
				{ className: 'oppList' },
				React.createElement(
					'h3',
					{ className: 'emptyOpp' },
					'No events match this filter'
				)
			)
		);
	}

	var oppNodes = this.state.data.map(function (opp) {
		var _React$createElement, _React$createElement2;

		var date = new Date(opp.date);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dt = date.getDate() + 1;

		return React.createElement(
			'div',
			{ key: opp._id, className: 'opp' },
			React.createElement(
				'h2',
				{ className: 'oppName' },
				opp.name
			),
			React.createElement(
				'h3',
				null,
				'Date'
			),
			React.createElement(
				'p',
				{ className: 'oppDate' },
				month,
				'-',
				dt,
				'-',
				year
			),
			React.createElement(
				'h3',
				null,
				'Info'
			),
			React.createElement(
				'p',
				{ className: 'oppInfo' },
				opp.info
			),
			React.createElement(
				'h3',
				null,
				'Contact'
			),
			React.createElement(
				'div',
				{ className: 'contactInfo' },
				React.createElement(
					'p',
					{ className: 'oppEmail' },
					opp.email
				),
				React.createElement(
					'p',
					{ className: 'oppPhone' },
					opp.phone
				),
				React.createElement(
					'p',
					{ className: 'oppOther' },
					opp.other
				)
			),
			React.createElement(
				'form',
				(_React$createElement = {
					className: 'responseForm'
				}, _defineProperty(_React$createElement, 'className', 'oppForm'), _defineProperty(_React$createElement, 'onSubmit', this.handleRSVP), _defineProperty(_React$createElement, 'name', 'responseForm'), _defineProperty(_React$createElement, 'action', '/rsvp'), _defineProperty(_React$createElement, 'method', 'POST'), _React$createElement),
				React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
				React.createElement('input', { type: 'hidden', name: 'uniqueId', value: opp.uniqueId }),
				React.createElement('input', { className: 'oppRespond', type: 'submit', value: 'RSVP' })
			),
			React.createElement(
				'form',
				(_React$createElement2 = {
					className: 'bookmarkForm'
				}, _defineProperty(_React$createElement2, 'className', 'oppForm'), _defineProperty(_React$createElement2, 'onSubmit', this.handleBookmark), _defineProperty(_React$createElement2, 'name', 'bookmarkForm'), _defineProperty(_React$createElement2, 'action', '/bookmark'), _defineProperty(_React$createElement2, 'method', 'POST'), _React$createElement2),
				React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
				React.createElement('input', { type: 'hidden', name: 'uniqueId', value: opp.uniqueId }),
				React.createElement('input', { className: 'oppBookmark', type: 'submit', value: 'Bookmark' })
			)
		);
	}.bind(this));

	return React.createElement(
		'div',
		null,
		React.createElement(
			'div',
			{ id: 'filters' },
			'FILTERS',
			React.createElement(
				'button',
				{ id: 'filterNone', onClick: this.loadOppsFromServer },
				'None'
			),
			React.createElement(
				'button',
				{ id: 'filterBookmark', onClick: this.loadOppsByBookmark },
				'Bookmarks'
			),
			React.createElement(
				'button',
				{ id: 'filterRSVP', onClick: this.loadOppsByRSVP },
				'RSVPs'
			)
		),
		React.createElement(
			'div',
			{ className: 'oppList' },
			oppNodes
		)
	);
};

var setup = function setup(csrf) {
	OppFormClass = React.createClass({
		displayName: 'OppFormClass',

		handleSubmit: handleMakeOpp,
		render: renderOpp
	});

	OppListClass = React.createClass({
		displayName: 'OppListClass',

		loadOppsFromServer: function loadOppsFromServer() {
			sendAjax('GET', '/getOpps', null, function (data) {
				this.setState({ data: data.opps });
			}.bind(this));

			$('#filterNone').className = 'selected';
			$('#filterBookmark').className = '';
			$('#filterRSVP').className = '';
		},
		loadOppsByBookmark: function loadOppsByBookmark() {
			sendAjax('GET', '/getBookmarks', null, function (data) {
				this.setState({ data: data.opps });
			}.bind(this));

			$('#filterNone').className = '';
			$('#filterBookmark').className = 'selected';
			$('#filterRSVP').className = '';
		},
		loadOppsByRSVP: function loadOppsByRSVP() {
			sendAjax('GET', '/getRSVPs', null, function (data) {
				this.setState({ data: data.opps });
			}.bind(this));

			$('#filterNone').className = '';
			$('#filterBookmark').className = '';
			$('#filterRSVP').className += 'selected';
		},
		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			this.loadOppsFromServer();
		},
		handleRSVP: handleRSVPOpp,
		handleBookmark: handleBookmarkOpp,
		render: renderOppList
	});

	oppForm = ReactDOM.render(React.createElement(OppFormClass, { csrf: csrf }), document.querySelector('#makeOpp'));

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
