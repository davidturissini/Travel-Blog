Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  match '/qunit' => "qunit#test"
  match '/me' => "users#me"
  match '/me/logout' => "users#logout"
  
  resources :users, {:path => ""} do 
   resources :location_types, {:path => ""}  do 
    resources :locations, {:path => ""} do
     resources :journal_entries, :except => [:index, :show]
    end
   end
  end
end
