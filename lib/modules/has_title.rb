module HasTitle
	def self.included(klass)
		klass.send :before_save, :sanitize_title
	end

   	def sanitize_title
   		if !title.nil?
   			convert = "[[___]]"
   			_title = title.gsub("\t", convert);
   			_title = _title.gsub("\n", convert);
   			_title = _title.gsub(/\r/, convert);
   			_title = _title.gsub(convert, " ")
   			_title = _title.gsub("  ", " ")
   			self.title = _title
   		end
   	end   
end