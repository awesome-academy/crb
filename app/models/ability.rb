class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    case
    when user.admin?
      can :manage, :all
    when user.normal?
      can [:read, :update], User, id: user.id
      can [:create, :read], Schedule
      can [:update, :destroy], Schedule, user_id: user.id
      can :destroy, Repeat, user_id: user.id
    end
  end
end
