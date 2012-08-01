module LocationHelper
 def new_location_path location_type
  new_user_location_type_location_path(location_type.user.slug, location_type.slug)
 end

 def edit_location_path loc
  edit_user_location_type_location_path(loc.user.slug, loc.location_type.slug, loc.slug)
 end

 def location_path loc
  user_location_type_location_path(loc.user.slug, loc.location_type.slug, loc.slug)
 end

 def location_link loc, options = {}
  path = location_path loc
  link_to loc.title, path, options.merge({ :class => "location #{loc.location_type.title.downcase}" })
 end
end
