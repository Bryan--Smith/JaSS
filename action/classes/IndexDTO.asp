<%

class IndexDTO

	public indexName
	public columnName
	public primaryKey
	public unique
	public ordinalPosition
	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "indexName" & QUOTE & ":" & QUOTE & indexName & QUOTE & ","		
		retValue = retValue & QUOTE & "columnName" & QUOTE & ":" & QUOTE & columnName & QUOTE & ","
		retValue = retValue & QUOTE & "isPrimaryKey" & QUOTE & ":" & lcase(primaryKey) & ","
		retValue = retValue & QUOTE & "isUnique" & QUOTE & ":" & lcase(unique) & ","
		retValue = retValue & QUOTE & "ordinalPosition" & QUOTE & ":" & ordinalPosition  
		
		retValue = retValue & "}"
		
		getJson = retValue		
	end function	


end class


%>