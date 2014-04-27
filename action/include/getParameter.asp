
<%

function getFormParameter(name)
	getFormParameter = Trim(Request.Form(name))
	if Len(getFormParameter) = 0 then
		Call Err.Raise(60000, "getFormParameters", "No value passed for '" & name & "' parameter.")
	end if
end function

%>