class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    case
    when user.admin?
      can :access, :rails_admin
      can :dashboard
      can :manage, User
      can [:create, :read, :destroy], Schedule
      can :update, Schedule do |schedule|
        schedule.finish_time > Time.zone.now
      end
      can :manage, Repeat
    when user.normal?
      can [:read, :update], User, id: user.id
      can [:create, :read], Schedule
      can :destroy, Schedule, user_id: user.id
      can :destroy, Repeat, user_id: user.id
      can :update, Schedule do |schedule|
        schedule.user_id == user.id && schedule.finish_time > Time.zone.now
      end
    end

  end
end
