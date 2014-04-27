
function isValidJetName(text) {
	return ( /^[a-zA-z][a-zA-Z0-9_]*$/.test(text) );
}

function isValidInteger(text) {
	return ( /^[0-9]+$/.test(text) );
}

function validateJetNameField($field) {
	var isValid = isValidJetName($field.val());
	return showValid(isValid, $field);
}

function validateIntegerField($field) {
	var isValid = isValidInteger($field.val());
	return showValid(isValid, $field);
}

function validateInput($field) {
	if ($field.hasClass("integer")) {
		validateIntegerField( $field );
	}
	else {
		validateJetNameField( $field );
	}
}

function validateTextArea($field) {
	var isValid = $field.val().length > 0;
	return showValid(isValid, $field);
}




function validateSelect($field) {
	var isValid = $field.val().length > 0;
	return showValid(isValid, $field);
}





function showValid(isValid, $field) {
	if (isValid) {
		$field.removeClass("jassError");
	}
	else {
		$field.addClass("jassError");
	}
	
	return isValid;
}

// Public function
function enableDisablePopupSubmit() {
	var $popup = $('#popup');
	
	var formDisabled = $popup.find(".jassError").filter(':visible').length > 0;
    $("#submit").prop('disabled', formDisabled);
}

// Public function

function addValidationHandlers($parent) {
	var $popup = $parent || $('#popup');
	
	$popup.find("input").each(function(index, element) {
		var $element = $(element);
		$element.on("change keyup", function() {
			validateInput( $element );
			enableDisablePopupSubmit( );
		});	
		validateInput( $element );
	});
	
	$popup.find("textarea").each(function(index, element) {
		var $element = $(element);
		$element.on("change keyup", function() {
			validateTextArea( $element );
			enableDisablePopupSubmit( );
		});	
		validateInput( $element );
	});	
	
	$popup.find("select").each(function(index, element) {
		var $element = $(element);
		$element.on("change", function() {
			validateSelect( $element );
			enableDisablePopupSubmit(  );
		});	
		validateSelect( $element );
	});	

	enableDisablePopupSubmit();
}