Rails.application.routes.draw do
  devise_for :users, controllers: {registrations: 'registrations'}

  root 'pages#home'

  namespace :admin do
    root "dashboard#home"
    resources :schedules, only: [:index, :update]
  end

  resources :schedules

  resources :users do
    resources :schedules, except: [:new, :create, :show]
  end

  get 'repeats/confirm'
end
