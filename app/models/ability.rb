class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    if user.is_admin?
      can :manager, :all
      can :destroy, User
    else
      can :read, :all
    end
    
    can :create, Schedule
    can [:edit, :update, :destroy], Schedule, user_id: user.id
  end
end
