<%

public function jsonEscape(text)
	QUOTE = """"
	
	text = Replace(text,"\","\\")
	text = Replace(text,chr(8),"\b")		' Backspace
	text = Replace(text,chr(12),"\f")		' Form Feed
	text = Replace(text,chr(10),"\n")		' New Line
	text = Replace(text,chr(13),"\r")		' Carriage Return
	text = Replace(text,chr(9),"\t")
	text = Replace(text,chr(11),"\v")
'	text = Replace(text,"'","\'")

	text = Replace(text, QUOTE,"\" & QUOTE)

	jsonEscape = text

end function

public sub toJson(resultSet)
	QUOTE = """"
	
	Set formatter = new DateFormatter
	
	response.write QUOTE & "pageCount" & QUOTE & ":" & resultSet.pageCount & ","
	response.write QUOTE & "absolutePage" & QUOTE & ":" & resultSet.absolutePage & ","
	response.write QUOTE & "recordCount" & QUOTE & ":" & resultSet.recordCount & ","
	response.write QUOTE & "pageSize" & QUOTE & ":" & resultSet.PageSize & ","
	
	response.write QUOTE & "columnHeadings" & QUOTE & ":["
	
	
	firstHeading = true
	for each field in resultSet.fields
		if firstHeading then
			firstHeading = false
		else
			response.write ","
		end if
		response.write QUOTE & field.name & QUOTE
	next
	response.write "]," & vbCRLF
	
	response.write QUOTE & "data" & QUOTE & ":["
	firstRow = true
	for i = 1 to resultSet.pageSize
'	do while not resultSet.EOF
		if resultSet.EOF then exit for
		
		if firstRow then
			firstRow = false
		else
			response.Write ","
		end if
		
		firstCol = true
		response.write "["
		for each field in resultSet.fields
			if firstCol then
				firstCol = false
			else
				response.write ","
			end if
			if isNull(field.value) then
				response.write "null"
			elseif varType(field.value) = vbDate then
				dateString = formatter.format(field.value, "%d %M %Y %H:%N:%S") 
				dateString = Replace(dateString, " 0:0:0", "")
				response.write QUOTE & dateString & QUOTE
			elseif varType(field.value) = VbString then
				response.write QUOTE & jsonEscape(field.value) & QUOTE
			elseif varType(field.value) = VbBoolean then
				response.write lcase(field.value)			
			else
				response.write field.value
			end if
		next
		response.write "]"
		
		resultSet.moveNext
		
	next

	response.write "]"
end sub


%>