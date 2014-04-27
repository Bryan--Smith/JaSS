<%

Class ProviderTypes

	
	public function typesDict(conn)
		Set mTypesDict = CreateObject("Scripting.Dictionary")

		Set rs1 = conn.openSchemaX(adSchemaProviderTypes)
		do while not rs1.EOF
			dataType = rs1("DATA_TYPE").value  ' e.g. 2, 3, 4, 5 ... 131
			isLong = rs1("IS_LONG").value
			key = dataType & isLong
			
			typeName1 = rs1("TYPE_NAME").value
			
			
			if not mTypesDict.exists(key) then
				mTypesDict.add key, typeName1
			end if
			rs1.moveNext
		loop	
		rs1.close
		
		Set typesDict = mTypesDict
	end function
	
End class

%>