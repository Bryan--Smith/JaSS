<%


class ConstraintDTO

	public name
	public constraintType
	public details
	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "name" & QUOTE & ":" & QUOTE & name & QUOTE & ","		
		retValue = retValue & QUOTE & "type" & QUOTE & ":" & QUOTE & constraintType & QUOTE & ","
		
		first = true
		retValue = retValue & QUOTE & "detail" & QUOTE & ": ["
		detailsArray = details.items

		if uBound(detailsArray) >= 0 then
			for j=0 to uBound(detailsArray)	
				if first then
					first = false
				else
					retValue = retValue & "," & vbCRLF
				end if
				retValue = retValue & detailsArray(j).getJson

			next
		end if

		retValue = retValue & "]"
		retValue = retValue & "}"
		
		getJson = retValue		
	end function
	
end class

class PrimaryConstraintDTO


	public columnName	
	public ordinal	
	

	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "columnName" & QUOTE & ":" & QUOTE & columnName & QUOTE & ","		
		retValue = retValue & QUOTE & "ordinal" & QUOTE & ":" & ordinal & "}"
		
		getJson = retValue		
	end function	
	
end class

class ForeignConstraintDTO


	public pkName
	public pkTableName
	public pkColumnName
	public fkTableName
	public fkColumnName
	public ordinal
	

	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "pkName" & QUOTE & ":" & QUOTE & pkName & QUOTE & ","	
		retValue = retValue & QUOTE & "pkTableName" & QUOTE & ":" & QUOTE & pkTableName & QUOTE & ","	
		retValue = retValue & QUOTE & "pkColumnName" & QUOTE & ":" & QUOTE & pkColumnName & QUOTE & ","	
		retValue = retValue & QUOTE & "fkTableName" & QUOTE & ":" & QUOTE & fkTableName & QUOTE & ","	
		retValue = retValue & QUOTE & "fkColumnName" & QUOTE & ":" & QUOTE & fkColumnName & QUOTE & ","			
		retValue = retValue & QUOTE & "ordinal" & QUOTE & ":" & ordinal & "}"
		
		getJson = retValue		
	end function	

end class

class CheckConstraintDTO


	public checkClause
	public description
	

	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "checkClause" & QUOTE & ":" & QUOTE & checkClause & QUOTE & ","	
		retValue = retValue & QUOTE & "description" & QUOTE & ":" & QUOTE & description & QUOTE & "}"
		
		getJson = retValue		
	end function	

end class

class UniqueConstraintDTO


	public columnName
	public ordinal	

	
	
	public function getJson
		QUOTE = """"

		retValue = "{"

		retValue = retValue & QUOTE & "columnName" & QUOTE & ":" & QUOTE & columnName & QUOTE & ","		
		retValue = retValue & QUOTE & "ordinal" & QUOTE & ":" & ordinal & "}"
		
		getJson = retValue		
	end function	
	
end class

%>