class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    if user.is_admin?
      can :read, :all
      can :destroy, User
      can :create, Schedule
      can [:edit, :update, :destroy], Schedule, user_id: user.id
    else
      can :read, :all
      can :create, Schedule
      can [:edit, :update, :destroy], Schedule, user_id: user.id
    end
  end
end