var table_height;
var init_event = "COMS6998 Event";

var geocoder = new google.maps.Geocoder();
var map;
var shadow_marker;
var marker_group = null;
var user;
var global_lng = null;
var global_lat = null;
var global_addr = null;

$(function() {
    (function() {
        user = userGetCurrentUser();
        if (user == null || user == undefined)
            window.location.href = "portal.html";
        console.log(user);
    }());

    // header buttons
    (function() {
        $("#button-groupevent").click(function() {
            $("#add-group-event-modal").modal("show");
        });

        $('#button-invitations').on('click', function() {
          if (! $('#right-container').is(':visible')) {
            $('#left-container').animate({
              width: '75%',
            }).promise().done(function() {$('#right-container').toggle();});
            console.log($('#left-container').height(), $('h2').height(), $('#left-container').height() - $('h2').height())
            $('#invitation-list').height(table_height);
            console.log($('#invitation-list'))
          } else {
            $('#right-container').toggle();
            $('#left-container').animate({
              width: '100%',
            });
            setTimeout(function(){
                map.invalidateSize();
            }, 500);
          }
        });

        $('#button-calendar-map').on('click', function() {
            var map_container = $('#map-container');
            if (!map_container.is(':visible')) {
                $('#calendar-container').toggle();
                map_container.toggle().promise().done(function(){
                    map_container.animate({
                        height: '100%'
                    });
                    setTimeout(function(){
                        map.invalidateSize();
                    }, 400);
                });
                // map_container.css('height', '100%').css('width', '100%');
                $('#button-calendar-map').find('i').removeClass('fa-map-marked-alt').addClass('fa-calendar-alt');
                get_and_rerender_events({'user_id': user['user_id']})
            } else {
                // map_container.css('height', '0px').css('width', '0px');
                map_container.animate({
                    height: 0
                }).promise().done(function(){
                    map_container.toggle();
                    $('#calendar-container').toggle();
                });
                $('#button-calendar-map').find('i').removeClass('fa-calendar-alt').addClass('fa-map-marked-alt');
                get_and_rerender_events({'user_id': user['user_id']})
            }
        });

        $('#user-profile-id').text(user['username']);
        $('#user-profile-email').text(user['email']);
        $('#signout').on('click', function(){
            window.userSignOut();
            window.location.href = "portal.html";
        });
        // $('#user-profile-my-events').append(user['MyEventsToday']);
        // $('#user-profile-friend-events').append(user['FriendEventsToday']);

        $('#button-user-profile').popover({
            html: true,
            placement: "auto",
            trigger: 'click',
            title: function() {
                return $(this).parent().find(".popover-title").html();
            },
            content: function() {
                return $(this).parent().find(".popover-content").html();
            }
        });
    }());

    // calendar 
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
            events: [],
            select: function(start, end) {
                // Display the modal.
                // You could fill in the start and end fields based on the parameters
                console.log(ts_to_datetime(start._i / 1000), moment(start).toDate())
                $('#add-event-modal').modal('show');
                $('#add-event-modal').find('#starts-at').val(moment(start).format());
            },
            eventClick: function(event, element) {
                // Display the modal and set the values to the event values.
                console.log(event);
                $('select').val(event.visibility)
                $('#view-event-modal').modal('show');
                $('#view-event-modal').attr('event_id', event.id);
                $('#view-event-modal').find('#title').val(event.title);
                $('#view-event-modal').find('#starts-at').val(moment(event.start).format('YYYY/MM/DD HH:mm'));
                $('#view-event-modal').find('#ends-at').val(moment(event.end).format('YYYY/MM/DD HH:mm'));
                $('#view-event-modal').find('#location').val(event.location);
                $('#view-event-modal').find('#description').val(event.description);
                $('#view-event-modal').find('#participants').val(event.participants);
                $('#view-event-modal select').val(event['visibility'].toString());
                if (!event['created']) {
                   $('#view-event-modal input').attr("disabled","disabled");
                   $("#view-event-modal select").attr("disabled", "disabled");
                   $('#view-event-modal #delete-event').attr('disabled', "disabled");
                   $('#view-event-modal #edit-event').attr('disabled', "disabled");
                }
                return event;
            },
            editable: true,
            eventLimit: "more", // allow "more" link when too many events
            height: $(window).height()*0.8
        });

        var base_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
        map = L.map('eventmap', {
            center: DEFAULT_MAP_CENTER, 
            zoom: DEFAULT_RADIUS,
            layers: [
                base_layer
            ]
        });
        map.doubleClickZoom.disable(); 
        map.on("dblclick", function(e) {
            $('#add-event-modal').modal('show');
            global_lat = e.latlng.lat;
            global_lng = e.latlng.lng;
            geocoder.geocode({
              'latLng': new google.maps.LatLng(global_lat, global_lng)
            }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  $("#add-event-modal").find("#location").val(results[0].formatted_address);
                  console.log(results);
                } else {
                }
              }
            });
        });
        table_height = $('table').height();
        
        get_and_rerender_events({"user_id": user['user_id']})
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
            $(this).find('#participants').val('');
		    $(this).find('#recommend-slots-list li').remove();
		    $(this).find('#plan-event').css('display', 'inline');
		    $(this).find('#cancel-event').css('display', 'none');
		    $(this).find('#group-save-event').css('display', 'none');
		    $(this).find('#recommend-slots').css('display', 'none');
            global_lng = null;
            global_lat = null;
		})

    	$('#add-event-modal').on('hidden.bs.modal', function () {
		    $(this).find('input').val('');
            global_lng = null;
            global_lat = null;
		})

        $('.location-autocomplete').geocomplete().bind("geocode:result", function(event, result){
            global_lng = result['geometry'].location.lng();
            global_lat = result['geometry'].location.lat();
        });

    	$('#view-event-modal').on('hidden.bs.modal', function () {
		    $(this).find('input').val('').removeAttr('disabled');
            $(this).find('select').val('0').removeAttr('disabled');
            $(this).find("button").removeAttr("disabled");
            global_lng = null;
            global_lat = null;
		})

        $(".modal-datepicker").datetimepicker();

        // Whenever the user clicks on the "save" button om the dialog
        $('#save-event').on('click', function() {
            var title = $(this).closest('.modal').find('#title').val();
            var visibility = $(this).closest('.modal').find('select').val();

            if (title) {
                var eventData = {
                    title: title,
                    start: $(this).closest('.modal').find('#starts-at').val(),
                    end: $(this).closest('.modal').find('#ends-at').val(),
                    coordinates: [global_lat, global_lng],
                    location: $(this).closest('.modal').find('#location').val(),
                    description: $(this).closest('.modal').find('#description').val(),
                };
                console.log(eventData);
                // TODO: call api, add event
                var params = {
                    "user_id": user['user_id'],
                    "event": {
                        "event_name": title,
                        "visibility": visibility,
                        "description": eventData["description"],
                        "location": eventData['location'],
                        "start_time": datetime_to_ts(new Date(eventData['start'])).toString(),   // optional
                        "end_time": datetime_to_ts(new Date(eventData['end'])).toString()         // optional
                    }
                }
                if (global_lat != null) {
                    params['event']['latitude'] = eventData['coordinates'][0].toString();        // optional
                    params['event']['longitude'] = eventData['coordinates'][1].toString();  // optional
                    params['event']['location'] = eventData['location'];
                }
                apigClient.calendarCreateEventPost({}, params).then(function(result){
                    console.log(result)
                    get_and_rerender_events({'user_id': user['user_id']})
                })
            }
            // hide modal
            $(this).closest('.modal').modal('hide');
        });

        // Whenever the user clicks on the "save" button om the dialog
        $('#group-save-event').on('click', function() {
            var title = $(this).closest('.modal').find('#title').val();
            var visibility = $(this).closest('.modal').find('select').val();
            var participants = $(this).closest('.modal').find('#participants').val().split(',')
            var selected_slot = $(this).closest('.modal').find('.active').text().split(' - ');
            participants.push(user['email']);

            console.log(title, visibility);
            if (title) {
                var eventData = {
                    title: title,
                    start: new Date(selected_slot[0]),
                    end: new Date(selected_slot[1]),
                    coordinates: [global_lat, global_lng],
                    location: $(this).closest('.modal').find('#location').val(),
                    description: $(this).closest('.modal').find('#description').val(),
                    participants: participants
                };
                // TODO: call api, add event
                var params = {
                    "user_id": user['user_id'],
                    "event": {
                        "event_name": title,
                        "visibility": visibility,
                        "description": eventData["description"],
                        "start_time": datetime_to_ts(new Date(eventData['start'])).toString(),   // optional
                        "end_time": datetime_to_ts(new Date(eventData['end'])).toString(),         // optional
                    },
                    "participant_emails" : eventData['participants']      // optional
                }
                if (global_lat != null) {
                    params['event']['latitude'] = eventData['coordinates'][0].toString();        // optional
                    params['event']['longitude'] = eventData['coordinates'][1].toString();  // optional
                    params['event']['location'] = eventData['location'];
                }
                apigClient.calendarCreateEventPost({}, params).then(function(result){
                    console.log(result)
                    get_and_rerender_events({'user_id': user['user_id']})
                })
            }
            // hide modal
            $(this).closest('.modal').modal('hide');
        });

        $('#edit-event').on('click', function(event) {
        	var chosenEvent = $('#calendar').fullCalendar('clientEvents', event._id)[0];
            var title = $(this).closest('.modal').find('#title').val();
            if (title) {
                chosenEvent.visibility = $(this).closest('.modal').find('select').val();
            	chosenEvent.title = title;
                chosenEvent.location = $(this).closest('.modal').find('#location').val();
                chosenEvent.start = new Date($(this).closest('.modal').find('#starts-at').val());
				chosenEvent.end = new Date($(this).closest('.modal').find('#ends-at').val());
                chosenEvent.description = $(this).closest('.modal').find('#description').val();
                chosenEvent.participants = $(this).closest('.modal').find('#participants').val()
                $('#calendar').fullCalendar('updateEvent', chosenEvent);
                console.log(chosenEvent['start'])
                console.log(ts_to_datetime(datetime_to_ts(chosenEvent['start'])).toString())
                console.log(ts_to_datetime(datetime_to_ts(chosenEvent['end'])).toString())

                var params = {
                    "event_id": $(this).closest(".modal").attr('event_id'),
                    "user_id":  user['user_id'],
                    "event": {
                        "event_name": title,
                        "visibility": chosenEvent['visibility'],
                        'location': chosenEvent['location'],
                        "start_time": datetime_to_ts(chosenEvent['start']),   // optional
                        "end_time": datetime_to_ts(chosenEvent['end']),         // optional
                        },
                    "participant_emails": chosenEvent.participants       // optional
                }
                if (global_lng != null) 
                    params['event']['longitude'] = global_lng;
                if (global_lat != null)
                    params['event']['latitude'] = global_lat;
                console.log(params)
                apigClient.calendarEditEventPut({}, params).then(function(result){
                    console.log(result)
                    get_and_rerender_events({'user_id': user['user_id']})
                })
            }
            // hide modal
            $(this).closest('.modal').modal('hide');
        });

        $('#delete-event').on('click', function(event) {
        	// TODO: call api, deletion
            console.log($(this).closest(".modal").attr('event_id'))
            apigClient.calendarDeleteEventPut({}, {
                "event_id": $(this).closest(".modal").attr('event_id')
            }).then(function(result){
                console.log(result)
                get_and_rerender_events({'user_id': user['user_id']})
            })
        	$(this).closest(".modal").modal('hide');
        });

        $('#plan-event').on('click', function(event) {
        	var chosenEvent = $('#calendar').fullCalendar('clientEvents', event._id)[0];
        	var ul = $('#recommend-slots-list');
            var modal = $(this).closest('.modal');
            var time_start = datetime_to_ts(new Date(modal.find("#starts-at").val()));
            var time_end = datetime_to_ts(new Date(modal.find("#ends-at").val()));
            var duration = modal.find('#duration').val();
            var participants = modal.find("#participants").val().split(",");
            participants.push(user['email'])
            console.log()
        	// TODO: call api, get recommendations
            apigClient.calendarRecommendationPut({}, {
              "messages": [
                {
                  "user_id": user['user_id'],
                  "min_start_time": time_start,
                  "max_end_time": time_end,
                  "duration": duration*60,       // TODO
                  "time_rigidity": 0,
                  "participants_email": participants
                }
              ]
            }).then(function(slots){
                console.log(slots)
                slots = slots['data']['messages'][0]['recommendations']
                for (var i=0; i<slots.length; i++) {
                    if (i >= 5) break;
                    console.log(ts_to_datetime(slots[i]['start_time']))
                    var string = reformat_datetime(ts_to_datetime(slots[i]['start_time'])) + " - " + reformat_datetime(ts_to_datetime(slots[i]['end_time']))
                    // <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
                    var item = $('<li/>').attr('class', 'list-group-item list-group-item-action text-center')
                                         .append(string).appendTo(ul);
                }
            }).then(function(){
                $('.list-group li').click(function(event) {
                    $('.list-group').find('li').removeClass('active');
                    $(this).addClass('active');
                });

                $('#plan-event').css('display', 'none');
                $('#recommend-slots').css('display', 'block');
                $('#plan-event').closest('.modal').find('#cancel-event').css('display', 'inline');
                $('#plan-event').closest('.modal').find('#group-save-event').css('display', 'inline');
            })
        });

        new L.Control.GPlaceAutocomplete({
            prepend: true,
            callback: function(place){
                var loc = place.geometry.location;
                map.panTo([loc.lat(), loc.lng()]);
            }
        }).addTo(map);
    }());

    // populate invitations
    (function(){
        var params = {
            "user_id":  user['user_id']
        }
        rerender_invitation_list(params)
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

function get_and_rerender_events(params) {
    apigClient.calendarGetEventGet(params, {}).then(function(result){
        console.log(result)
        var events = [];
        var map_events = [];
        var created = JSON.parse(result['data']['body']['created_event']);
        for(var i=0; i<created.length; i++) {
            events.push({
                id: created[i]['event_id'],
                title: created[i]['event_name'],
                start: ts_to_datetime(created[i]['unix_timestamp(start_time)']),
                end: ts_to_datetime(created[i]['unix_timestamp(end_time)']),
                coordinates: [created[i]['latitude'], created[i]['longitude']],
                location: created[i]['location'],
                visibility: created[i]['visibility'],
                created: true,
                color: PRIVATE_COLOR
            });
        }
        var participated = JSON.parse(result['data']['body']['participated_event'])
        for(var i=0; i<participated.length; i++) {
            events.push({
                id: participated[i]['event_id'],
                title: participated[i]['event_name'],
                start: ts_to_datetime(participated[i]['unix_timestamp(start_time)']),
                end: ts_to_datetime(participated[i]['unix_timestamp(end_time)']),
                coordinates: [participated[i]['latitude'], participated[i]['longitude']],
                location: participated[i]['location'],
                visibility: participated[i]['visibility'],
                created: false,
                color: FRIEND_COLOR
            });
        }
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', events);

    // {
    //     location: [40.7911, -73.9694],
    //     content: "private 1",
    //     date: new Date(2019, 3, 13),
    //     time: new Date(2019,3,13,5,30,0,0)
    // }

        if (marker_group != null) {
            map.removeLayer(marker_group);
            marker_group.length = 0;
        }
        var marker_list = [];
        for(var i=0; i<events.length; i++) {
            if (events[i]['coordinates'][0] == null || events[i]['coordinates'][1] == null)
                continue;
            var cur_marker = L.ExtraMarkers.icon({
                // icon: 'fa-number',
                // number: i+1,
                markerColor: 'blue-dark'
            })
            var cur_marker = L.marker(events[i]['coordinates'], {"icon": cur_marker}).bindPopup(
                L.popup().setContent(make_popup_content(events[i]['title']))
            );
            marker_list.push(cur_marker)
        }
        marker_group = L.layerGroup(marker_list);
        map.addLayer(marker_group);
    })
}

function rerender_invitation_list(params) {
    apigClient.calendarInvitationsGetInvitationGet(params, {}).then(function(invitations){
        $('#invitation-list').empty();
        invitations = JSON.parse(invitations['data']['body']['invitations'])
        for(var i=0; i<invitations.length; i++) {
          var invitation = invitations[i];
          console.log(invitation);

          var creator_id = invitation['creator_id'];
          var invitation_id = invitation['event_invitation_id'];
          var event_name = invitation['event']['event_name'];
          var event_id = invitation['event']['event_id'];
          var event_lat = invitation['event']['latitude'];
          var event_lng = invitation['event']['longitude'];
          var event_location = invitation['event']['location'];
          var event_time_start = invitation['event']['unix_timestamp(start_time)'];
          var event_time_end = invitation['event']['unix_timestamp(end_time)'];
          var event_description = invitation['event']['description'];
          var event_visibility = invitation['event']['visibility'];

          console.log(event_location)
          apigClient.userGetByUidUidGet({
          "uid": creator_id,
          }, {}).then(function(creator_user){
            var li = $("<li/>").attr('class', 'list-group-item').attr('id', invitation_id)
                                 .attr('lat', event_lat).attr('lng', event_lng)
                                 .css('border', 'none').css('border-bottom', '2px solid #ddd').css('padding-top', '5px').css('padding-bottom', '5px')
                                 .hover(function() {
                                    $(this).css('backgroundColor', '#ddd');
                                    if ($('#calendar-container').is(':visible')) {
                                        var id = $(this).attr('id');
                                        var tmp = {
                                            id: id,
                                            title: event_name,
                                            start: ts_to_datetime(event_time_start),
                                            end: ts_to_datetime(event_time_end),
                                            borderColor: "#ddd",
                                            backgroundColor: "#ddd"
                                        }
                                        $('#calendar').fullCalendar('renderEvent', tmp);
                                    }
                                    if ($('#map-container').is(':visible')) {
                                        shadow_marker = L.marker([parseFloat($(this).attr('lat')), parseFloat($(this).attr('lng'))], {
                                            "icon": L.ExtraMarkers.icon({
                                                icon: 'fa-plus',
                                                prefix: 'fa',
                                                markerColor: 'green'
                                            })
                                        });
                                        shadow_marker.addTo(map);
                                    }
                                 }, function() {
                                    $(this).css('backgroundColor', '#fff');
                                    var id = $(this).attr('id');
                                    if ($('#calendar-container').is(':visible')) {
                                        $('#calendar').fullCalendar('refetchEvents');
                                    }
                                    if ($('#map-container').is(':visible')) {
                                        map.removeLayer(shadow_marker);
                                    }
                                 });
              var container = $('<div/>').attr('class', 'card').append(
                    $('<div/>').attr('class', 'row card-body').append(
                        $('<img/>').attr('class', 'col-sm-4').attr('src', './img/default_avatar.png').css('padding', '5px 5px 5px 10px')
                    ).append(
                        $('<div />').attr('class', 'col-sm-6').css('padding', '5px').append(
                          $('<h5 />').attr('class', 'card-title').append(event_name)
                        ).append(
                          $('<h6 />').attr('class', 'card-subtitle mb-2 text-muted').append(creator_user['data']['username'])
                        ).append(
                          $('<h6 />').attr('class', 'card-subtitle mb-2 text-muted').append(event_location)
                        )
                    ).append(
                        $('<div />').attr('class', 'col-sm-2').append(
                          $('<a/>').attr('role', 'button').attr('class', 'button-right invitation-more-btn').css('margin-top', '20px').css('margin-bottom', '0px')
                                   .on('click', function(){
                                       $('#view-event-modal').modal('show');
                                       $('#view-event-modal #title').val(event_name);
                                       $('#view-event-modal #starts-at').val(reformat_datetime(ts_to_datetime(event_time_start)));
                                       $('#view-event-modal #ends-at').val(reformat_datetime(ts_to_datetime(event_time_end)));
                                       $('#view-event-modal #location').val(event_location);
                                       $('#view-event-modal #description').val(event_description);
                                       $('#view-event-modal select').val(event_visibility.toString());
                                       // TODO get participants
                                       $('#view-event-modal input').attr("disabled","disabled");
                                       $("#view-event-modal select").attr("disabled", "disabled");
                                   }).append($('<i/>').attr('class', 'fas fa-ellipsis-h'))
                        ).append(
                          $('<a/>').attr('role', 'button').attr('class', 'button-right invitation-accept-btn').css('margin', '0px')
                                   .on('click', function() {
                                       $(this).closest('li').animate({
                                         margin: '0px',
                                         padding: '0px',
                                         height: '0px'
                                       }, 500, function() {
                                         $(this).remove();
                                       });
                                        apigClient.calendarInvitationsAcceptInvitationPost({}, {
                                            "event_invitation_id": li.attr('id'),
                                            "user_id":  user['user_id']
                                        }).then(function(result){
                                            console.log(result);
                                            rerender_invitation_list({'user_id': user['user_id']})
                                            get_and_rerender_events({'user_id': user['user_id']})
                                        })
                          }).append($('<i/>').attr('class', 'fas fa-plus-square'))
                        ).append(
                          $('<a/>').attr('role', 'button').attr('class', 'button-right invitation-ignore-btn').css('margin', '0px')
                                   .on('click', function() {
                                       $(this).closest('li').animate({
                                         margin: '0px',
                                         padding: '0px',
                                         height: '0px'
                                       }, 500, function() {
                                         $(this).remove();
                                       });
                                        apigClient.calendarInvitationsIgnoreInvitationPost({}, {
                                            "event_invitation_id": li.attr('id'),
                                            "user_id":  user['user_id']
                                        }).then(function(result){
                                            console.log(result)
                                            rerender_invitation_list({'user_id': user['user_id']})
                                        })
                                       $('#calendar').fullCalendar('refetchEvents');
                          }).append($('<i/>').attr('class', 'fas fa-minus-square'))
                        )
                    )
                  ).appendTo(li);
              $('#invitation-list').append(li);
          })
        };
    });
}