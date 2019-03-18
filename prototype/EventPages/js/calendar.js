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
            select: function(start, end) {
                // Display the modal.
                // You could fill in the start and end fields based on the parameters
                $('.modal').modal('show');

            },
            eventClick: function(event, element) {
                // Display the modal and set the values to the event values.
                $('.modal').modal('show');
                $('.modal').find('#title').val(event.title);
                $('.modal').find('#location').val(event.location);
                $('.modal').find('#starts-at').val(event.start);
                $('.modal').find('#ends-at').val(event.end);
                $('.modal').find('#description').val(event.description);
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
  });
}
