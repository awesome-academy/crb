class EditRepeatWorker
  include Sidekiq::Worker

  def perform sample_schedule_id, announce, sample_added_member_ids = [], sample_removed_member_ids = []
    schedule_sample = Schedule.find_by id: sample_schedule_id

    if schedule_sample
      schedules = Schedule.filter_by_repeat schedule_sample.repeat_id
      sample_shared_member_ids = schedule_sample.member_ids - sample_added_member_ids
      added_list = Hash.new {|hash, key| hash[key] = Array.new}
      removed_list, shared_list = added_list.dup, added_list.dup

      schedules.each do |schedule|
        schedule_id = schedule.id
        old_member_ids = schedule.member_ids unless sample_schedule_id == schedule_id

        day = schedule.start_time.day
        schedule.start_time = schedule_sample.start_time.change day: day
        schedule.finish_time = schedule_sample.finish_time.change day: day

        schedule.attributes = schedule_sample.attributes.except "id", "start_time", "finish_time"
        schedule.members = schedule_sample.members

        if schedule.valid?
          schedule.save

          unless sample_schedule_id == schedule_id
            new_member_ids = schedule.member_ids
            added_member_ids = new_member_ids - old_member_ids
            removed_member_ids = old_member_ids - new_member_ids
            shared_member_ids = new_member_ids & old_member_ids
          else
            added_member_ids = sample_added_member_ids
            removed_member_ids = sample_removed_member_ids
            shared_member_ids = sample_shared_member_ids
          end

          added_member_ids.each{|member_id| added_list[member_id] << schedule_id}
          removed_member_ids.each{|member_id| removed_list[member_id] << schedule_id}
          shared_member_ids.each{|member_id| shared_list[member_id] << schedule_id}
        end
      end

      added_list.each do |member_id, repeated_schedule_ids|
        MembersInvitationWorker.perform_async [member_id], repeated_schedule_ids
      end

      removed_list.each do |member_id, repeated_schedule_ids|
        RemovedMembersAnnouncementWorker.perform_async [member_id], repeated_schedule_ids
      end

      shared_list.each do |member_id, repeated_schedule_ids|
        UpdatedEventsAnnouncementWorker.perform_async([member_id], repeated_schedule_ids) if announce
      end
    end
  end
end
