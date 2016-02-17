# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160216090618) do

  create_table "creators", force: :cascade do |t|
    t.string "email",        limit: 255
    t.string "display_name", limit: 255
  end

  create_table "repeats", force: :cascade do |t|
    t.integer  "repeat_type", limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.integer  "user_id",     limit: 4
  end

  create_table "rooms", force: :cascade do |t|
    t.string   "name",           limit: 255
    t.string   "color",          limit: 255
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "google_room_id", limit: 255
  end

  create_table "schedule_users", force: :cascade do |t|
    t.integer  "user_id",     limit: 4
    t.integer  "schedule_id", limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "schedules", force: :cascade do |t|
    t.string   "title",            limit: 255
    t.text     "description",      limit: 65535
    t.datetime "start_time"
    t.datetime "finish_time"
    t.string   "state",            limit: 255,   default: "pending"
    t.integer  "user_id",          limit: 4
    t.integer  "room_id",          limit: 4
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.integer  "repeat_id",        limit: 4
    t.integer  "announced_before", limit: 4
    t.string   "google_event_id",  limit: 255
    t.string   "google_link",      limit: 255
    t.integer  "creator_id",       limit: 4
    t.text     "attendee",         limit: 65535
  end

  add_index "schedules", ["room_id"], name: "index_schedules_on_room_id", using: :btree
  add_index "schedules", ["user_id"], name: "index_schedules_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name",                   limit: 255, default: "Default User"
    t.string   "email",                  limit: 255, default: "",             null: false
    t.string   "encrypted_password",     limit: 255, default: "",             null: false
    t.string   "role",                   limit: 255
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,              null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "avatar",                 limit: 255
    t.string   "provider",               limit: 255
    t.string   "uid",                    limit: 255
    t.string   "token",                  limit: 255
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "schedules", "rooms"
  add_foreign_key "schedules", "users"
end
