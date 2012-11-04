class Admin::JournalsController < Admin::AdminController
	def index
		@trip = current_trip
		@journals = @trip.journals
	end

	def new
		@user = current_user
		@trip = current_trip
		@journal = @trip.journals.new
	end

	def create
		@trip = current_trip
		params[:journal][:body] = clean_html(params[:journal][:body])
		@journal = @trip.journals.new(params[:journal])
		@journal.set_slug!(String.slugify(@journal.title), @trip.journals)
		@journal.save!
		render :json => @journal
	end

	def update
		@trip = current_trip
		params[:journal][:body] = clean_html(params[:journal][:body])
		@journal = @trip.journals.find_by_slug(params[:journal_id])
		@journal.update_attributes!(params[:journal])
		render :json => @journal
	end

	def destroy
		@trip = current_trip
		@journal = @trip.journals.find_by_slug(params[:journal_id])
		@journal.destroy
		render :json => @journal
	end

	def edit
		@trip = current_trip
		@journal = @trip.journals.find_by_slug(params[:journal_id])
	end

	protected
	def clean_html html
		 Sanitize.clean(html, :elements => ['a', 'p', 'ul', 'strong', 'em', 'span', 'blockquote'])
	end
	def current_trip
		current_user.trips.find_by_slug(params[:trip_id])
	end
end