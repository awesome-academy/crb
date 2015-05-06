Rails.application.routes.draw do
  devise_for :users

  root 'pages#home'
  get 'help' => 'pages#help'

  namespace :admin do
    resources :schedules, only: [:index, :update]
  end

  resources :schedules, except: [:show]
  
  resources :users do
    resources :schedules, only: :index
  end
end