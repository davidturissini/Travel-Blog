module HasSlug
	def set_slug! _slug, collection
		
		if unique?(_slug, collection) 
			_s = _slug
		else
			_s = get_unique_slug _slug, collection
		end
		self.update_attribute(:slug, _s)
	end

	protected
	def get_unique_slug _slug, collection, index = 1
		_s = "#{_slug}-#{index}"
		return _s if unique?(_s, collection)
		return get_unique_slug(_slug, collection, index + 1)
	end

	def unique? _slug, collection
		model = collection.find_by_slug(_slug)
		model.nil? && !black_list.include?(_slug)
	end

	def black_list
		["new", "edit", "update", "delete"]
	end
end