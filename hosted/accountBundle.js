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

var handleUsernameChange = function handleUsernameChange(e){
	e.preventDefault();

	if( $('#currentUsername') == '' || ('#pass').val() == ''){
		handleError('All fields are required');
		return false;
	}

	sendAjax('POST', $('#usernameChangeForm').attr('action'), $('#usernameChangeForm').serialize(), redirect);

	return false;
}

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
			{ htmlFor: 'pass' },
			'Change Password:'
		),
		React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'new password' }),
		React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
		React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change Password' })
	);
};

var renderUsernameChangeWindow = function renderUsernameChangeWindow(){
	return React.createElement(
		'form',
		{ id: 'usernameChangeForm',
			name: 'usernameChangeForm',
			onSubmit: this.handleSubmit,
			action: '/usernameChange',
			method: 'POST',
			className: 'mainForm'
		},
		React.createElement(
			'label',
			{ htmlFor: 'username' },
			'Change Username:'
		),
		React.createElement('input', { id: 'username', type: 'username', name: 'username', placeholder: 'new username' }),
		React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
		React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change Username' })
	);
};

var createPasswordChangeWindow = function createPasswordChangeWindow(csrf) {
	var PasswordChangeWindow = React.createClass({
		displayName: 'PasswordChangeWindow',
		handleSubmit: handlePasswordChange,
		render: renderPasswordChangeWindow,
	});

	ReactDOM.render(React.createElement(PasswordChangeWindow, { csrf: csrf }), document.querySelector('#passchange'));
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

const handleError = (message) => {
	$("#errorMessage").text(message);
	$("#errorMessage").animate({
		opacity: 1,
	}, 500);
	$("#errorMessage").animate({
		opacity: 0,
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
