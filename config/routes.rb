Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'

  match '/test/:test_path' => "qunit#test"

  match '/auth/:provider/callback' => "users#login"
  match '/me' => "admin/users#me", :via => :get, :as => "me", :user_id => "me"
  match '/me/logout' => "users#logout", :as => "logout", :user_id => "me"

  match '/welcome' => "welcome#user", :as => "welcome_user"
  match '/template/:path' => "template#load"
  match "/:user_id/template/:path" => "admin/template#load"
  match '/about' => "static#about"

  resources :countries, :only => [:index]

  resources :users, :path => "", :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/users"
  match '/users/validate_slug' => "users#validate_slug"
  match '/:user_id' => "users#show"
  resources :users, :path => "" do 
    match '/flickr_photoset_photos/:photoset_id' => "admin/users#photoset_photos"
    resources :countries
    resources :locations
    resources :photos, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/photos" do
      match "reprocess" => "admin/photos#reprocess", :via => "get"
    end
    resources :photos, :only => [:show, :index]
    resources :maps
    resources :posts, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/posts"
    resources :posts, :only => [:show, :index]
    resources :trips, :only => [:index]
    resources :trips, :only => [:show], :path => "" do
      resources :maps, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/maps"
      resources :maps, :only => [:show, :index], :controller => "trips/maps"
      resources :locations, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/locations"
      resources :locations, :only => [:show, :index]
      resources :posts, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/posts"
      resources :posts, :only => [:show, :index]
      resources :photos, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/photos"
      resources :photos, :only => [:show, :index]
    end
    resources :trips, :path => "", :only => [:edit, :update, :destroy], :controller => "admin/trips" do
      match '/merge', :via => "post", :action => :merge
    end
    resources :trips, :path => "/trips", :only => [:new, :create], :controller => "admin/trips"
  end
end
