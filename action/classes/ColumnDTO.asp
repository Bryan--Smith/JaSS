<%

class ColumnDTO

	public isPrimaryKey
	public isForeignKey
	public columnName
	public ordinalPosition
	public dataType
	public typeName
	public isLong
	public isNullable
	public flags
	public characterMaximumLength
	public numericPrecision
	public numericScale
	
	public function getJson
		QUOTE = """"
		
		retValue = "{"

		retValue = retValue & QUOTE & "columnName" & QUOTE & ":" & QUOTE & columnName & QUOTE & ","		
		retValue = retValue & QUOTE & "isPrimaryKey" & QUOTE & ":" & LCase(isPrimaryKey) & ","
		retValue = retValue & QUOTE & "isForeignKey" & QUOTE & ":" & LCase(isForeignKey) & ","
		retValue = retValue & QUOTE & "ordinalPosition" & QUOTE & ":" & ordinalPosition & ","
		retValue = retValue & QUOTE & "dataType" & QUOTE & ":" & dataType & ","
		retValue = retValue & QUOTE & "typeName" & QUOTE & ":" & QUOTE & typeName & QUOTE & ","
		retValue = retValue & QUOTE & "isNullable" & QUOTE & ":" & LCase(isNullable) & ","
		retValue = retValue & QUOTE & "flags" & QUOTE & ":" & flags & ","
		retValue = retValue & QUOTE & "isLong" & QUOTE & ":" & LCase(isLong) & ","
		retValue = retValue & QUOTE & "characterMaximumLength" & QUOTE & ":" & nullIfNoValue(characterMaximumLength) & ","
		retValue = retValue & QUOTE & "numericPrecision" & QUOTE & ":" & nullIfNoValue(numericPrecision) & ","
		retValue = retValue & QUOTE & "numericScale" & QUOTE & ":" & nullIfNoValue(numericScale)
		retValue = retValue & "}"
		
		getJson = retValue
	end function
	
	private function nullIfNoValue(value)
		if isNull(value) then
			nullIfNoValue = "null"
		else
			nullIfNoValue = value
		end if
	
	end function
end class

%>