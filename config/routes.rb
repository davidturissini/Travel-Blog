Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  match '/qunit' => "qunit#test"
  match '/me' => "users#me"
  match '/me/logout' => "users#logout"
  resources :users, {:path => ""} do 
   resources :location_types, {:path => ""}  do 
    resources :locations, {:path => ""}
   end
  end
end
