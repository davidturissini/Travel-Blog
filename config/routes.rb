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
    resources :photos, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/photos"
    resources :photos, :only => [:show, :index]
    resources :maps
    resources :trips, :only => [:show, :index], :path => "" do
      resources :maps, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/maps"
      resources :maps, :only => [:show, :index]
      resources :locations, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/locations"
      resources :locations, :only => [:show, :index]
      resources :journals, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/journals"
      resources :journals, :only => [:show, :index]
      resources :photos, :only => [:edit, :update, :destroy, :new, :create], :controller => "admin/photos"
      resources :photos, :only => [:show, :index]
    end
    resources :trips, :path => "", :only => [:edit, :update, :destroy], :controller => "admin/trips"
    resources :trips, :path => "/trips", :only => [:new, :create], :controller => "admin/trips"
  end
end
