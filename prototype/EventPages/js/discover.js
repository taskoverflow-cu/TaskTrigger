var map;
var autocomplete;

var init_event = "COMS6998 Event";
var user;
var marker_group = null;
var params = DEFAULT_DISCOVER;


$(function() {
    (function() {
        user = userGetCurrentUser();
        if (user == null || user == undefined)
            window.location.href = "portal.html";
        console.log(user);
    }());

	// header controllers
	(function() {
        $('#button-calendar-map').on('click', function() {
          var map_container = $('#map-container');
          if (!map_container.is(':visible')) {
              params = DEFAULT_DISCOVER;
              $('#discover-container').toggle();
              map_container.toggle().promise().done(function(){
                  map_container.animate({
                    height: '100%'
                  });
                  setTimeout(function(){
                    map.invalidateSize();
                  }, 400);
              });
              $('#button-calendar-map').find('i').removeClass('fa-map-marked-alt').addClass('fa-list');
          } else {
              params = DEFAULT_DISCOVER;
              map_container.animate({
                height: 0
              }).promise().done(function() {
                  map_container.toggle();
                  $('#discover-container').toggle();
              });
              $('#button-calendar-map').find('i').removeClass('fa-list').addClass('fa-map-marked-alt');
          }
        });

        $("#item-list-event-name").on("change", function(event) {
            params['event_name'] = $(this).val();
            params['event_keywords'] = $(this).val();
            console.log(params['event_name'])
            get_events_and_rerender(params);
        });

        $("#item-list-starts-at").on("dp.change", function(event) {
            params['time_leftbound'] = datetime_to_ts(new Date(event.date))
            get_events_and_rerender(params)
        });

        $("#item-list-ends-at").on("dp.change", function(event) {
            params['time_rightbound'] = datetime_to_ts(new Date(event.date))
            get_events_and_rerender(params)
        });

        $("#item-list-location").on("change", function(event) {
            if ($(this).val() == null || $(this).val() == undefined || $(this).val() == ""){
                delete params['longitude'];
                delete params['latitude'];
                delete params['radius'];
                map.setView(DEFAULT_MAP_CENTER);
            }
        });

        $("#item-list-location").geocomplete().bind("geocode:result", function(event, result){
            console.log(event, );
            params['longitude'] = result['geometry'].location.lng();
            params['latitude'] = result['geometry'].location.lat();
            params['radius'] = DEFAULT_RADIUS;
            map.setView([params['latitude'], params['longitude']])
            if ($("#map-container").is(':visible')) {
                params['radius'] = getMapRadiusKM();
                console.log(params['radius'])
            }
            get_events_and_rerender(params);
        });

        $('#item-private-ckbx').on('click', function() {
            if ($("#item-private-ckbx").hasClass('active')) {
            } else {
                $("#item-private-ckbx").addClass('active');
                $('#item-friend-ckbx').removeClass('active');
                $('#item-public-ckbx').removeClass('active');
                params['user_id'] = user['user_id'];
                params['visibility'] = 1;
                get_events_and_rerender(params);
            }
        });

        $('#item-friend-ckbx').on('click', function() {
            if ($("#item-friend-ckbx").hasClass('active')) {
            } else {
                $("#item-friend-ckbx").addClass('active');
                $('#item-private-ckbx').removeClass('active');
                $('#item-public-ckbx').removeClass('active');
                params['user_id'] = user['user_id'];
                params['visibility'] = 2;
                get_events_and_rerender(params);
            }
        });

        $('#item-public-ckbx').on('click', function() {
            if ($("#item-public-ckbx").hasClass('active')) {
            } else {
                $("#item-public-ckbx").addClass('active');
                $('#item-private-ckbx').removeClass('active');
                $('#item-friend-ckbx').removeClass('active');
                params['user_id'] = user['user_id'];
                params['visibility'] = 4;
                get_events_and_rerender(params);
            }
        });

        $('#user-profile-id').text(user['username']);
        $('#user-profile-email').text(user['email'])
        $('#signout').on('click', function(){
            window.userSignOut();
            window.location.href = "portal.html";
        });

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

	// initialize
	(function() {
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
        map.on('zoomend', function() {
            params['radius'] = getMapRadiusKM();
            get_events_and_rerender(params);
        });
        $(".map-datepicker").datetimepicker();
        $('#item-public-ckbx').click();
    }());
})

function getMapRadiusKM() {
    var mapBoundNorthEast = map.getBounds().getNorthEast();
    var mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());
    return mapDistance/1000;
}

function make_popup_content(content) {
    return content;
}

function get_events_and_rerender(params) {
    apigClient.discoverSearchEventPut({}, {
        "messages": [params]
    }).then(function(result){
        console.log(result)
        remap_discover_list(params['visibility'], result);
        rerender_discover_list(result);   
        $('.button-add-to-calendar').on('click', function() {
            console.log('you clicked on add to calendar');
            var parent = $(this).closest('.controls');
            parent.find('.button-add-to-calendar').remove();
            parent.append(
                    $('<a/>').attr('class', 'btn btn-light disabled')
                             .append(
                                $('<i/>').attr('class', 'fas fa-check').css('color', 'green')
                             )
                  ).append(
                    'Added'
                  );
            // TODO api, confirm request
        });
    })
}

function remap_discover_list(visibility, events) {
    console.log(events)
    events = events['data']['messages'][0]['events']
    if (marker_group != null) {
        map.removeLayer(marker_group);
        marker_group.length = 0;
    }
    var event_list_parsed = [];
    for (var i = 0; i < events.length; i++) {
        var event_name = events[i]['event_name'];
        var event_id = events[i]['event_id'];
        var event_start_time = ts_to_datetime(events[i]['start_time']);
        var event_end_time = datetime_to_ts(events[i]['end_time']);
        var event_longitude = events[i]['longitude']
        var event_latitude = events[i]['latitude']
        var event_capacity = events[i]['capacity']
        var event_visibility = events[i]['visibility']
        var event_creator_id = events[i]['creator_id']
        var event_location = events[i]['location']
        var event_description = events[i]['description']
        var color;
        console.log(events[i]);
        if (event_visibility == 1)
            color = "blue-dark";
        else if (event_visibility == 2)
            color = "green-dark";
        else if (event_visibility == 4)
            color = "yellow";

        // {
        //     location: [40.8084, -73.9438],
        //     content: "friend 4",
        //     date: new Date(2019, 3, 13),
        //     time: new Date(2019,3,13,8,30,0,0)
        // }
        var cur_marker = L.ExtraMarkers.icon({
            // icon: 'fa-number',
            // number: i+1,
            markerColor: color
        })
        var cur_marker = L.marker([event_latitude, event_longitude], {"icon": cur_marker}).bindPopup(
            L.popup().setContent(make_popup_content(event_name))     // TODO
        );
        event_list_parsed.push(cur_marker)
    }
    marker_group = L.layerGroup(event_list_parsed);
    map.addLayer(marker_group);
}

function rerender_discover_list(events) {
    apigClient.calendarGetEventGet({
        "user_id": user['user_id']
    }, {}).then(function(result){
        var created = JSON.parse(result['data']['body']['created_event']);
        var participated = JSON.parse(result['data']['body']['participated_event'])
        var alreadyInEvents = {};
        for (var i=0; i<created.length; i++){
            alreadyInEvents[created[i]['event_id']] = created[i];
        }
        for(var i=0; i<participated.length; i++){
            alreadyInEvents[participated[i]['event_id']] = participated[i];
        }
        events = events['data']['messages'][0]['events']
        $('#event-list').empty().show();
        if (events.length == 0) {
            $('#event-list').append(
                $("<li/>").attr('class', 'list-group-item').append("no result found")
            );
        }
        for (var i = 0; i < events.length; i++) {
            var event_name = events[i]['event_name'];
            var event_id = events[i]['event_id'];
            var event_start_time = reformat_datetime(ts_to_datetime(events[i]['start_time']));
            var event_end_time = reformat_datetime(ts_to_datetime(events[i]['end_time']));
            var event_longitude = events[i]['longitude']
            var event_latitude = events[i]['latitude']
            var event_capacity = events[i]['capacity']
            var event_visibility = events[i]['visibility']
            var event_creator_id = events[i]['creator_id']
            var event_location = events[i]['location']
            var event_description = events[i]['description']

            var li = $('<li/>').attr('class', 'list-group-item');
            var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

            var img = $('<div/>').attr('class', 'col-12 col-sm-6 col-md-2 px-0')
                                                     .attr('id','imgDiv').append(
                    $('<img/>').attr('src', DEFAULT_EVENT_AVATAR)
                                 // .attr('alt', events[i]['name'])
                                 .attr('class', 'rounded-circle mx-auto d-block img-fluid')
                ).appendTo(container);

            var textContainer = $('<div/>').attr('class', 'col-md-6 text-sm-left').append(
                    $('<span/>').attr('class', 'float-right pulse')
                ).append(
                    $('<label/>').attr('class', 'name lead').append(event_name)
                ).append(
                    $('<br>')
                ).append(
                    $('<span/>').attr('class', 'far fa-chess-king fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', event_creator_id)
                ).append(
                    $('<span/>').attr('class', 'text-muted').append(event_creator_id)
                ).append(
                    $('<br>')
                ).append(
                    $('<span/>').attr('class', 'fa fa-calendar-alt fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', event_start_time)
                ).append(
                    $('<span/>').attr('class', 'text-muted').append(event_start_time + "  -  " + event_end_time)
                ).append(
                    $('<br>')
                ).append(
                    $('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', event_location)
                ).append(
                    $('<span/>').attr('class', 'text-muted').append(event_location)
                ).append(
                    $('<br>')
                // ).append(
                    // $('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['phoneNum'])
                // ).append(
                    // $('<span/>').attr('class', 'text-muted small').append(events[i]['phoneNum'])
                // ).append(
                    // $('<br>')
                ).append(
                    $('<span/>').attr('class', 'fa fa-info-circle fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', event_description)
                ).append(
                    $('<span/>').attr('class', 'text-muted small').append(event_description)
                ).appendTo(container);

            if (!alreadyInEvents[event_id]) {
                var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
                        $('<a/>').attr('class', 'btn btn-primary button-add-to-calendar button-add-event').attr('id', event_id).text('Add to Calendar').on('click', function() {
                            console.log($(this).attr('id'))
                            apigClient.discoverAddEventPut({}, {
                              "messages": [
                                {
                                  "user_id": user['user_id'],
                                  "event_id": $(this).attr('id')
                                }
                              ]
                            }).then((result) => {
                                console.log($(this))
                                $(this).closest('a').attr('class', '').css('color', 'green').text("I'm going");
                            })
                        })
                    ).appendTo(container);
            } else {
                var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
                        $('<span/>').css('color', 'green').append("I'm going")
                    ).appendTo(container);
            }

            $('#event-list').append(li);
        }
    })
}