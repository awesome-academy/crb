class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :schedules, dependent: :destroy

  has_many :schedule_users
  has_many :events, class_name: "Schedule", through: :schedule_users,  foreign_key: :user_id

  validates :name, presence: true, length: {maximum: 100}
  validates :role, presence: true, length: {maximum: 50}

  def is_admin?
    role == "admin"
  end
end
