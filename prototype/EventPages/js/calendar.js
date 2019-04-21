$(function() {
    (function() {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: format_date(new Date()),
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectHelper: true,
            events: [
              {
                title: "event1",
                start: "2019-03-01",
                end: "2019-03-20",
              }
            ],
            select: function(start, end) {
                // Display the modal.
                // You could fill in the start and end fields based on the parameters
                $('#add-event-modal').modal('show');
                // location.href = './addevent.html'
            },
            eventClick: function(event, element) {
                // Display the modal and set the values to the event values.
                $('#view-event-modal').modal('show');
                $('#view-event-modal').find('#title').val(event.title);
                $('#view-event-modal').find('#starts-at').val(event.start);
                $('#view-event-modal').find('#ends-at').val(event.end);
                $('#view-event-modal').find('#location').val(event.location);
                $('#view-event-modal').find('#description').val(event.description);
                $('#view-event-modal').find('#participants').val(event.participants);
            },
            editable: true,
            eventLimit: "more" // allow "more" link when too many events
        });
    }());

    // independent widgets
    (function() {
        $('.datepicker').datetimepicker();
        // $('select').formSelect();
        // $('.chips').chips();
        // $('.chips-placeholder').chips({
        //     placeholder: 'Enter a tag',
        //     secondaryPlaceholder: '+Tag',
        //     limit: 20,
        //   });
    }());

    // modal controllers
    (function() {
    	$('#add-group-event-modal').on('hidden.bs.modal', function () {
		    $(this).find('input').val('');
		    $(this).find('#recommend-slots-list li').remove();
		    $(this).find('#plan-event').css('display', 'inline');
		    $(this).find('#cancel-event').css('display', 'none');
		    $(this).find('#save-event').css('display', 'none');
		    $(this).find('#recommend-slots').css('display', 'none');
		})

    	$('#add-event-modal').on('hidden.bs.modal', function () {
		    $(this).find('input').val('');
		})

    	$('#view-event-modal').on('hidden.bs.modal', function () {
		    $(this).find('input').val('');
		})

        $("#starts-at, #ends-at").datetimepicker();

        // Whenever the user clicks on the "save" button om the dialog
        $('#save-event').on('click', function() {
            var title = $(this).closest('.modal').find('#title').val();
            console.log(title);
            if (title) {
                var eventData = {
                    title: title,
                    start: $(this).closest('.modal').find('#starts-at').val(),
                    end: $(this).closest('.modal').find('#ends-at').val(),
                    location: $(this).closest('.modal').find('#location').val(),
                    description: $(this).closest('.modal').find('#description').val(),
                    participants: $(this).closest('.modal').find('#participants').val()
                };
                $('#calendar').fullCalendar('renderEvent', eventData, true);
                // TODO: call api, add event
            }
            // hide modal
            $(this).closest('.modal').modal('hide');
        });

        $('#edit-event').on('click', function(event) {
        	var chosenEvent = $('#calendar').fullCalendar('clientEvents', event._id)[0];
            var title = $(this).closest('.modal').find('#title').val();
            if (title) {
            	chosenEvent.title = title;
                chosenEvent.location = $(this).closest('.modal').find('#location').val(),
                chosenEvent.start = $(this).closest('.modal').find('#starts-at').val(),
				chosenEvent.end = $(this).closest('.modal').find('#ends-at').val(),
                chosenEvent.description = $(this).closest('.modal').find('#description').val(),
                chosenEvent.participants = $(this).closest('.modal').find('#participants').val()
                $('#calendar').fullCalendar('updateEvent', chosenEvent);
                // TODO: call api, update event
            }
            // hide modal
            $(this).closest('.modal').modal('hide');
        });

        $('#delete-event').on('click', function(event) {
        	$('#calendar').fullCalendar('removeEvents', event._id);
        	// TODO: call api, deletion
        	$(this).closest(".modal").modal('hide');
        });

        $('#plan-event').on('click', function(event) {
        	var chosenEvent = $('#calendar').fullCalendar('clientEvents', event._id)[0];
        	var ul = $('#recommend-slots-list');
        	// TODO: call api, get recommendations
        	var slots = ['time slot1', 'time slot2', 'time slot3', 'time slot4', 'time slot5'];
        	for (var i=0; i<slots.length; i++) {
        		// <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
        		var item = $('<li/>').attr('class', 'list-group-item list-group-item-action text-center')
        							 .append(slots[i]).appendTo(ul);
        	}

        	$('.list-group li').click(function(event) {
		        $('.list-group').find('li').removeClass('active');
		        $(this).addClass('active');
		    });

        	$(this).css('display', 'none');
            $(this).closest('.modal').find('#recommend-slots').css('display', 'block');
        	$(this).closest('.modal').find('#cancel-event').css('display', 'inline');
        	$(this).closest('.modal').find('#save-event').css('display', 'inline');
        });
    }());

    // header buttons
    (function() {
        $("#button-groupevent").click(function() {
            $("#add-group-event-modal").modal("show");
        });

        $('#button-invitations').on('click', function() {
          $('#hidden-container').toggle("fast", function() {
            if (! $('#hidden-container:visible').length) {
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
    }());

    // populate invitations
    (function(){
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
    }());
});

function format_date(raw_date) {
  var dd = String(raw_date.getDate()).padStart(2, '0');
  var mm = String(raw_date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = raw_date.getFullYear();
  return yyyy + "-" + mm + '-' + dd;  
}