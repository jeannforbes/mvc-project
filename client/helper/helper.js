const handleError = (message) => {
	$("#errorMessage").text(message);
	$("#errorMessage").animate({
		opacity: 1,
	}, 500);
	$("#errorMessage").animate({
		opacity: 0,
	}, 3000);
};

const redirect = (response) => {
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error){
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};