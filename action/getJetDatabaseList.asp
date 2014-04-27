
<!-- #include file="classes/CfgFileReader.asp" -->
<%
'  http://localhost/access-db/action/getJetDatabaseList.asp
QUOTE = """"



 Set fso = CreateObject("Scripting.FileSystemObject")

	
response.write "{" & vbCRLF
response.write QUOTE & "jetMenu" & QUOTE & ": " & vbCRLF
response.write "[" & vbCRLF


	
 firstDir = true

	
	
set cfgFileReaderObj = new CfgFileReader
set mapx = cfgFileReaderObj.readCfg
directoryString = mapx.item("mdbDirectory")


directoryArray = split(directoryString, ",")
for i = 0 to uBound(directoryArray)
	dirName = directoryArray(i)
	if fso.FolderExists(dirName) = True then
	
		if firstDir then
			firstDir = false
		else
			response.write ","
		end if
		
		response.write "{" & vbCRLF
		response.write QUOTE & "label" & QUOTE & ": " & QUOTE & replace(dirName, "\", "\\") & QUOTE & "," & vbCRLF
		response.write QUOTE & "dbType" & QUOTE & ": " & QUOTE & "DIRNAME" & QUOTE & "," & vbCRLF
		response.write QUOTE & "children" & QUOTE & " : [" & vbCRLF					
	

		Set folder = fso.GetFolder(dirName)
		Set files = folder.Files
		  
		firstFile = true
		For each file In files
			fileName = file.name
			suffix = Right(fileName, 4)
			
			if suffix = ".mdb" then
				if firstFile  then
					firstFile = false
				else
					response.write "," 
				end if
				
				response.write "{" & QUOTE & "label" & QUOTE & ": " & QUOTE  & fileName & QUOTE & "," & vbCRLF
				response.write QUOTE & "fileName" & QUOTE & ": " & QUOTE & replace(dirName, "\", "\\") & "\\" & fileName & QUOTE & "," & vbCRLF
				response.write QUOTE & "dbType" & QUOTE & ": " & QUOTE & "jetDatabase" & QUOTE & "," & vbCRLF
				response.write QUOTE & "load_on_demand" & QUOTE & ": " & QUOTE & "true" & QUOTE & "}" & vbCRLF

			
			end if
		Next
			
		response.write "]"
		response.write "}"
	
	else
		response.write "(does not exist" & dirName & ")" &vbCRLF
	end if
next


response.write "]" & vbCRLF
response.write "}"


		


%>