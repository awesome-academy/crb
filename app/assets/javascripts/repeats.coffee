# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$(document).ready ->
  $("[class *=schedule] input[type=submit]").click (event) ->
    repeat_checked = $("input[name*=repeat]:checked")
    if repeat_checked.length > 0
      event.preventDefault()
      $data = $("[class *=schedule]").serialize()
      $.ajax
        url: "/repeats/confirm"
        type: "GET"
        data: $data
        success: (result) ->
          overlap_time_days = result.overlap_time_days
          if overlap_time_days.length > 0
            retVal = confirm "Overlap Time Days: #{overlap_time_days} \nDo you want to continue ?"
            if retVal is true
              $("[class *=schedule]").submit()
            else
              return false
          else
            $("[class *=schedule]").submit()
