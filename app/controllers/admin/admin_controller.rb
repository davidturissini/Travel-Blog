class Admin::AdminController < ApplicationController
	before_filter :validate_user?
end