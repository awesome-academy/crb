require "rails_helper"

describe User do
  let(:user) {create :user}
  subject {user}

  describe "#user" do
    context "has a valid user" do
      it {is_expected.to be_an User}
    end
  end

  describe "#name" do
    describe "#validate presence" do
      before do
        subject.name = nil
        subject.save
      end
      context "should invalid withouth name" do
        it {expect(subject.errors[:name].size).to eq 1}
      end
    end

    describe "#validate length" do
      context "should invalid when maxinum length large than 100" do
        before do
          subject.name = "abcdefghij" * 100
          subject.save
        end
        it {expect(subject.errors[:name].size).to eq 1}
      end

      context "should valid when maxinum length smaller than 100" do
        before do
          subject.name = "abcdefghij" * 5
          subject.save
        end
        it {expect(subject.errors[:name].size).to eq 0}
      end
    end
  end

  describe "#avatar_size_method" do
    context "#validate" do
      it {allow(subject).to receive(:avatar_size)}
    end
  end

  describe "#avatar" do
    before {@another_user = create :user_with_avatar}
    context "should validate upload avatar" do
      it {expect(@another_user).to be_valid}
    end
  end

  describe "#user_role" do
    context "response to check user is normal" do
      it {expect(subject.admin?).to eq false}
      it {expect(subject.normal?).to eq true}
    end

    context "response to check user is admin" do
      before do
        subject.role = Settings.user_roles.admin
        subject.save
      end
      it {expect(subject.admin?).to eq true}
      it {expect(subject.normal?).to eq false}
    end
  end

  describe ".with_ids" do
    context "return the user if equal with id finding" do
      before {@another_user = subject.id}
      it {expect(User.with_ids(@another_user)).to include subject}
    end
  end

  describe ".without_user" do
    context "return the user if equl with id finding" do
      before {@another_user = 12}
      it {expect(User.without_user(@another_user)).to include subject}
    end
  end
  
  describe "#ActiveRecord associations" do
    it {expect(subject).to have_many(:repeats).dependent :destroy}
    it {expect(subject).to have_many :schedule_users}
    it {expect(subject).to have_many(:schedules).dependent :destroy}
    it {expect(subject).to have_many(:events).class_name("Schedule").through(:schedule_users).with_foreign_key "user_id"}
  end
end
