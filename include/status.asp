

<%

public sub successJson()
	QUOTE = """"
	response.write QUOTE & "status" & QUOTE & ": " & QUOTE & "OK" & QUOTE 
end sub

public sub resultTypeJson(resultType)
	QUOTE = """"
	response.write QUOTE & "resultType" & QUOTE & ": " & QUOTE & resultType & QUOTE 
end sub

public sub failJson(message)
	QUOTE = """"
	response.write QUOTE & "status" & QUOTE & ": " & QUOTE & "ERROR" & QUOTE & ","
	response.write QUOTE & "errorMessage" & QUOTE & ": " & QUOTE & message & QUOTE
end sub

%>