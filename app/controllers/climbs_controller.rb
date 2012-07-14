class ClimbsController < ApplicationController
 def index
  @climbs = Climb.all
 end

 def show
  @climb = Climb.find_by_slug(params[:id])
  render_404 if !@climb
 end
end
