module LocationHelper
 def location_link loc, options = {}
  path = location_path loc
  link_to loc.title, path, options.merge({ :class => "location #{loc.location_type.title.downcase}" })
 end

 def location_image loc
 	image loc.photo_url, { :title => loc.title, :alt => loc.title }
 end

 def location_string_parts location
 	s = ""
 	s = "#{s} #{link_to location.title, location_path(location)} in " if location.title
 	s += link_to location.geo_string, location_path(location)
 end

 def location_string_link location
 	s = ""
 	s = "#{s} #{link_to location.title, location_path(location)} in " if location.title
 	s += link_to location.geo_string, location_path(location)
 end

 def location_string location
 	s = ""
 	s = "#{location.title} in " if location.title
 	s += location.geo_string
 end
end
