Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  resources :users do 
   resources :location_types do 
    resources :locations
   end
  end
end
