window.onload=function(){    
    $(document).ready(function() {
      $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: '2019-03-12',
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectHelper: true,
            events: [
              {
                title: "event1",
                start: "2019-03-01",
                end: "2019-03-20"
              }
            ],
            select: function(start, end) {
                // Display the modal.
                // You could fill in the start and end fields based on the parameters
                // $('.modal').modal('show');
                location.href = './addevent.html'
            },
            eventClick: function(event, element) {
                // Display the modal and set the values to the event values.
                // $('.modal').modal('show');
                // $('.modal').find('#title').val(event.title);
                // $('.modal').find('#location').val(event.location);
                // $('.modal').find('#starts-at').val(event.start);
                // $('.modal').find('#ends-at').val(event.end);
                // $('.modal').find('#description').val(event.description);
                location.href = './viewevent.html'
            },
            editable: true,
            eventLimit: "more" // allow "more" link when too many events

        });

        // Bind the dates to datetimepicker.
        // You should pass the options you need
        $("#starts-at, #ends-at").datetimepicker();

        // Whenever the user clicks on the "save" button om the dialog
        $('#save-event').on('click', function() {
            var title = $('#title').val();
            if (title) {
                var eventData = {
                    title: title,
                    location: $('#location').val(),
                    start: $('#starts-at').val(),
                    end: $('#ends-at').val(),
                    description: $('#description').val()
                };
                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $('#calendar').fullCalendar('unselect');

            // Clear modal inputs
            $('.modal').find('input').val('');

            // hide modal
            $('.modal').modal('hide');
        });

        $('#button-invitations').on('click', function() {
          $('#hidden-container').toggle("fast", function() {
            if (! $('#hidden-container:visible').length) {
              console.log('invisible');
              $('#shown-container').animate({
                width: '100%',
              });
              $('#hidden-container').removeClass('col-sm-3').addClass('col-sm-0');
              $('#shown-container').removeClass('col-sm-9').addClass('col-sm-12');
            } else {
              console.log('visible')
              $('#shown-container').animate({
                width: '70%',
              });
              $('#hidden-container').removeClass('col-sm-0').addClass('col-sm-3');
              $('#invitation-list').height($('table').css('height'));
              $('#shown-container').removeClass('col-sm-12').addClass('col-sm-9');
            }
          });
        });

        // populate invitations
        var invitations = [
          {
            "Host": "Mike",
            "TimeStart": "2019-3-20 19:00",
            "TimeEnd": "2019-3-20 20:00",
            "Description": "sample invitation 1, some descriptions here..."
          },
          {
            "Host": "Sam",
            "TimeStart": "2019-3-20 19:00",
            "TimeEnd": "2019-3-20 20:00",
            "Description": "sample invitation 2, some descriptions here..."
          }
        ]
        for(var i=0; i<invitations.length; i++) {
          var li = $("<li/>").attr('class', 'list-group-item').css('border', 'none').css('border-bottom', '2px solid #ddd');
          var container = $('<div/>').attr('class', 'row w-100').append(
                $('<row/>').append(
                  $('<div />').attr('class', 'col-12 col-md-3').append(
                    $('<span/>').attr('class', 'text-muted').append(invitations[i]['Host'])
                  )
                ).append(
                  $('<div />').attr('class', 'col-12 col-md-9').append(
                    $('<span/>').attr('class', 'text-muted').append(invitations[i]['TimeStart'])
                  ).append(
                    $("<br/>")
                  ).append(
                    $('<span/>').attr('class', 'text-muted').append(invitations[i]['TimeEnd'])
                  )
                )
              ).append(
                $('<row/>').append(
                  $('<div/>').attr('class', 'col-12 col-md-12').css('padding-right', '0').append(
                    $('<span/>').attr('class', 'text-muted').append(invitations[i]['Description'])
                  )
                )
              ).append(
                $('<row/>').css('float', 'right').append(
                  $('<a/>').attr('type', 'button').attr('href', './viewGroupEventRequest.html').css('padding-right', '6px').css('padding-top', 'none').css('padding-bottom', 'none').append('more')
                ).append(
                  $('<a/>').attr('type', 'button').css('padding-right', '6px').css('padding-top', 'none').css('padding-bottom', 'none').on('click', function() {
                    $(this).closest('li').animate({
                      margin: '0px',
                      padding: '0px',
                      height: '0px'
                    }, 500, function() {
                      $(this).remove();
                    });
                  }).append('accept')
                ).append(
                  $('<a/>').attr('type', 'button').css('padding-right', '6px').css('padding-top', 'none').css('padding-bottom', 'none').on('click', function() {
                    $(this).closest('li').animate({
                      margin: '0px',
                      padding: '0px',
                      height: '0px'
                    }, 500, function() {
                      $(this).remove();
                    });
                  }).append('ignore')
                )
              ).appendTo(li);
              $('#invitation-list').append(li);
        };
  });
}
