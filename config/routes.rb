Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'

  match '/test/:test_path' => "qunit#test"

  match '/auth/:provider/callback' => "users#login"
  match '/me' => "admin/users#me", :via => :get, :as => "me"
  match '/me/logout' => "users#logout", :as => "logout"

  match '/welcome' => "welcome#user", :as => "welcome_user"
  match '/template/:path' => "template#load"

  match '/me' => "admin/users#update", :via => :put
  match '/me/edit' => "admin/users#edit_me", :as => "edit_me"
  match "/:user_id/template/:path" => "admin/template#load"
  match '/:user_id/locations/create' => "admin/locations#create"

  match '/about' => "static#about"

  resources :countries, :only => [:index]

  match '/:user_id' => "users#show"
  match '/:user_id/new' => "location_types#new"

  resources :users, {:path => ""} do 
    resources :locations, {:path => ""} do
     resources :journal_entries, :except => [:index, :show]
    end
  end
end
