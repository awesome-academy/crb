Rails.application.routes.draw do
  devise_for :users

  root 'pages#home'
  get 'help' => 'pages#help'

  namespace :admin do
    resources :schedules, only: [:index, :update]
  end

  resources :schedules
  
  resources :users do
    resources :schedules, except: [:new, :create, :show]
  end
end