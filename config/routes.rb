Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  resources :climbs
end
