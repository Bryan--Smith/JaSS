

<%

class Arrays

	public function sort(array2Sort)
		arrayUbound = UBound(array2Sort)

		'The actual sort process
		For I = 0 to arrayUbound
			TempVAR_1 = 0
			TempVAR_2 = 0
			For P = 0 to arrayUbound
				If array2Sort(I) < array2Sort(P) Then
				TempVAR_1 = array2Sort(I)
				TempVAR_2 = array2Sort(P)
				array2Sort(I) = TempVAR_2
				array2Sort(P) = TempVAR_1
				End IF
			Next 'P
		Next 'I

		sort = array2Sort
	
	end function
end class
%>