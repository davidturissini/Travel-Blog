class String
 class << self
  def slugify str
   return str.strip.downcase.gsub(/[^0-9a-z \-]/i, '').gsub(" ", "-") if str
   return nil
  end
 end
end
