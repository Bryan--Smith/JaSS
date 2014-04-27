<%

public sub toJson(resultSet)
	QUOTE = """"
	
	Set formatter = new DateFormatter
	
	response.write QUOTE & "pageCount" & QUOTE & ":" & resultSet.pageCount & ","
	response.write QUOTE & "absolutePage" & QUOTE & ":" & resultSet.absolutePage & ","
	response.write QUOTE & "RecordCount" & QUOTE & ":" & resultSet.recordCount & ","
	
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
				response.write QUOTE & formatter.format(field.value, "%d %M %Y %H:%N:%S") & QUOTE
			elseif varType(field.value) = VbString then
				response.write QUOTE & field.value & QUOTE
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