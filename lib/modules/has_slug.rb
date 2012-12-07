module HasSlug
	def set_slug! _slug, collection
		_s = HasSlug.get_unique_slug _slug, collection
		self.update_attribute(:slug, _s)
	end

	def self.get_unique_slug _slug, collection, index = 1
		if HasSlug.unique?(_slug, collection)
			_s = _slug
		else
			_s = "#{_slug}-#{index}"
		end
		return _s if unique?(_s, collection)
		return self.get_unique_slug(_slug, collection, index + 1)
	end

	def self.unique? _slug, collection
		model = collection.find_by_slug(_slug)
		model.nil? && !black_list.include?(_slug)
	end

	def self.black_list
		["new", "edit", "update", "delete"]
	end
end