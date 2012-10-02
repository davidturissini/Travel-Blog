class Admin::StatusesController < Admin::AdminController
	def create
		status = Status.create!(params[:status])

		render :json => status
	end

	def destroy
		status = Status.find(params[:status_id])
		status.destroy
		render :json => status
	end
end