class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :schedules, dependent: :destroy
  has_many :schedule_users
  has_many :events, class_name: "Schedule", through: :schedule_users, foreign_key: :user_id
  has_many :repeats, dependent: :destroy

  validates :name, presence: true, length: {maximum: 100}

  before_create{self.role ||= Settings.user_roles[:normal]}

  Settings.user_roles.each do |_, user_role|
    define_method("#{user_role}?") {user_role == role}
  end
end
