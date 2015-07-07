module ScheduleJson
  def min_json
    {
      id: id,
      title: title,
      start_time: start_time,
      finish_time: finish_time,
      description: description,
      user_id: user_id,
      room_name: room_name,
      room_color: room_color,
      repeat_id: repeat_id
    }
  end
end
