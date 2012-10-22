module HasSlug
	def set_slug! _slug, collection
		model = collection.find_by_slug(_slug)
		if model.nil?
			_s = _slug
		else
			_s = get_unique_slug _slug, collection
		end
		self.slug = _s
	end

	protected
	def get_unique_slug _slug, collection, index = 1
		_s = "#{_slug}-#{index}"
		model = collection.find_by_slug(_s)
		return _s if model.nil?
		return get_unique_slug(_slug, collection, index + 1)
	end
end