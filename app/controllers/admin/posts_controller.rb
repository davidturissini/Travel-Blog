class Admin::PostsController < Admin::AdminController
	def index
		@user = current_user
		@trip = current_trip
		@journals = @trip.journals
	end

	def new
		@user = current_user
		@trip = current_trip
		@post = @trip.posts.new
	end

	def create
		params[:post][:body] = clean_html(params[:post][:body])
		@post = current_user.posts.new(params[:post])
		@post.set_slug!(String.slugify(@post.title || Digest::SHA1.hexdigest(Time.now.to_s)), current_user.posts)
		@post.save!
		render :json => @post
	end

	def update
		@user = current_user
		params[:post][:body] = clean_html(params[:post][:body])
		@post = @user.posts.find_by_slug(params[:id])
		@post.update_attributes!(params[:post])
		render :json => @journal
	end

	def destroy
		@trip = current_trip
		@journal = @trip.journals.find_by_slug(params[:id])
		@journal.destroy
		render :json => @journal
	end

	def edit
		@user = current_user
		@trip = current_trip
		@journal = @trip.journals.find_by_slug(params[:id])
	end

	protected
	def clean_html html
		 Sanitize.clean(html, :elements => ['a', 'p', 'ul', 'strong', 'em', 'span', 'blockquote'])
	end
	def current_trip
		current_user.trips.find_by_slug(params[:trip_id])
	end
end