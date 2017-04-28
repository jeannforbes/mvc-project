'use strict';

var handlePasswordChange = function handlePasswordChange(e) {
	e.preventDefault();

	if ( $('#currentPass').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
		handleError('All fields are required');
		return false;
	}

	if ( $('#pass').val() !== $('#pass2').val() ) {
		handleError('Passwords do not match');
		return false;
	}

	sendAjax('POST', $('#passwordChangeForm').attr('action'), $('#passwordChangeForm').serialize(), redirect);

	return false;
};

var renderPasswordChangeWindow = function renderPasswordChange() {
	return React.createElement(
		'form',
		{ id: 'passwordChangeForm',
			name: 'passwordChangeForm',
			onSubmit: this.handleSubmit,
			action: '/passwordChange',
			method: 'POST',
			className: 'mainForm'
		},
		React.createElement(
			'label',
			{ htmlFor: 'currentPass' },
			'Old Password:'
		),
		React.createElement('input', { id: 'currentPass', type: 'password', name: 'currentPass', placeholder: 'old password' }),
		React.createElement(
			'label',
			{ htmlFor: 'pass' },
			'New Password:'
		),
		React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'new password' }),
		React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
		React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change Password' })
	);
};

var createPasswordChangeWindow = function createPasswordChangeWindow(csrf) {
	var PasswordChangeWindow = React.createClass({
		displayName: 'PasswordChangeWindow',

		handleSubmit: handlePasswordChange,
		render: renderPasswordChangeWindow,
	});

	ReactDOM.render(React.createElement(PasswordChangeWindow, { csrf: csrf }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
	var passwordChangeButton = document.querySelector('#passwordChangeButton');

	passwordChangeButton.addEventListener("click", function (e) {
		e.preventDefault();
		createPasswordChangeWindow(csrf);
		return false;
	});

	createPasswordChangeWindow(csrf);
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
