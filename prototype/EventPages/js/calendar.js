var init_x = 40.807537
var init_y = -73.962570
var init_event = "COMS6998 Event"
var scale = 12
var private_mark_data = [
    {
        location: [40.7911, -73.9694],
        content: "private 1",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,5,30,0,0)
    },
    {
        location: [40.7767, -73.9673],
        content: "private 2",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,6,30,0,0)
    },
    {
        location: [40.7651, -73.9922],
        content: "private 3",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,7,30,0,0)
    },
    {
        location: [40.7492, -73.9758],
        content: "private 4",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,8,30,0,0)
    }
]

var map;
var private_mark_whole_list;
var private_mark_list;
var private_mark_group;


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
            eventLimit: "more", // allow "more" link when too many events
            height: $(window).height()*0.8
        });

        private_mark_whole_list = [];
        for(var i=0; i<private_mark_data.length; i++) {
            var cur_marker = L.ExtraMarkers.icon({
                icon: 'fa-number',
                number: i+1,
                markerColor: 'blue'
            })
            var cur_marker = L.marker(private_mark_data[i]['location'], {"icon": cur_marker}).bindPopup(
                L.popup().setContent(make_popup_content(private_mark_data[i]['content']))
            );
            private_mark_whole_list.push(cur_marker)
        }
        private_mark_list = private_mark_whole_list.slice(0);
        private_mark_group = L.layerGroup(private_mark_list);

        var base_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
        map = L.map('eventmap', {
            center: [init_x, init_y], 
            zoom: scale,
            layers: [
                base_layer,
                private_mark_group
            ]
        });
        map.doubleClickZoom.disable(); 
        map.on("dblclick", function(e) {
            $('#add-event-modal').modal('show');
        })
    }());

    // map control widgets
    (function() {
        // time ranges
        $(".map-datepicker").datetimepicker();
        $("#map-starts-at").on("dp.change", function(event) {
            var timestamp = new Date(event.date);
            console.log(timestamp);
            reduce_all_layer_group_by_time(timestamp, true);
        });
        $("#map-ends-at").on("dp.change", function(event) {
            var timestamp = new Date(event.date);
            console.log(timestamp);
            reduce_all_layer_group_by_time(timestamp, false)
        });
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

        $(".modal-datepicker").datetimepicker();

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
            console.log($('#eventmap').is('visible'));
            if (! $('#eventmap').is('visible')) {
              if ($('#hidden-container').is(':visible')) {
                console.log('not visible')
                $('#shown-container').animate({
                  width: '70%',
                });
                $('#invitation-list').height($('table').css('height'));
                $('#hidden-container').css('display', 'block');
              } else {
                console.log('visible')
                $('#shown-container').animate({
                  width: '100%',
                });
                $('#hidden-container').css('display', 'none');
              }
            }
          });
        });

        $('#button-calendar-map').on('click', function() {
          $('#cal-container').toggle();
          var map_container = $('#map-container');

          map_container.toggle("fast", function() {
            if (map_container.is(':visible')) {
              map_container.css('height', '100%').css('width', '100%');
              map_container.css('display', 'block');
              $('#button-calendar-map').find('i').removeClass('fa-map-marked-alt').addClass('fa-calendar-alt');
              setTimeout(function(){
                map.invalidateSize();
              }, 0);
            } else {
              map_container.css('height', '0px').css('width', '0px');
              map_container.css('display', 'none');
              $('#button-calendar-map').find('i').removeClass('fa-calendar-alt').addClass('fa-map-marked-alt');
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

function make_popup_content(content) {
    return content;
}

function check_timestamp_valid(mark_list, j, whole_list, i, cur_ts, target_ts, start_check) {
    if (start_check == true) {
        if (cur_ts >= target_ts) {
            return 1;
        } else {
            mark_list.splice(j, 1);
            return 0;
        }
    } else {
        if (cur_ts <= target_ts) {
            return 1;
        } else {
            mark_list.splice(j, 1);
            return 0;
        }
    }
}

// reduce by date when date_check == true, reduce by time when date_check == false
// reduce by starting time when start_check == true, reduce by ending time when start_check == false
function reduce_layer_group_by_time(visible, group_layer, mark_list, whole_list, mark_data, timestamp, start_check) {
    map.removeLayer(group_layer);
    var cur_timestamp;
    var j=0;
    if (visible) {
        for (var i=0; i<whole_list.length; i++) {
            cur_timestamp = mark_data[i]['date'].getTime() + mark_data[i]['time'].getTime();
            j += check_timestamp_valid(mark_list, j, whole_list, i, cur_timestamp, timestamp, start_check);
        }
    }
    console.log(mark_list.length);
    group_layer = L.layerGroup(mark_list);
    map.addLayer(group_layer);
    return group_layer;
}


function reduce_all_layer_group_by_time(timestamp, start) {
    private_mark_group = reduce_layer_group_by_time(
        true,
        private_mark_group, 
        private_mark_list, 
        private_mark_whole_list, 
        private_mark_data,
        timestamp, start
        )
}