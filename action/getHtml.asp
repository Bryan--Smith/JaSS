

<%

FOR_READING = 1
ASCII = 0

htmlFileName = Request.QueryString("htmlFileName")
htmlFileName = Server.mapPath(htmlFileName)


Set fso = CreateObject("Scripting.FileSystemObject")
If fso.FileExists(htmlFileName) Then
	Set objStream = fso.OpenTextFile(htmlFileName, FOR_READING, False, ASCII)  ' 1, 0

	fileContents = ""

	Do While Not objStream.AtEndOfStream
		fileContents = fileContents & objStream.ReadLine & vbCFLF
	loop
	objStream.Close

	response.write fileContents
end if



%>