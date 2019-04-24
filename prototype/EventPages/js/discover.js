var map;
var autocomplete;

var init_x = 40.807537;
var init_y = -73.962570;
var init_event = "COMS6998 Event";
var scale = 12;
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
];

var friend_mark_data = [
    {
        location: [40.7495, -73.9726],
        content: "friend 1",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,5,30,0,0)
    },
    {
        location: [40.7501, -73.9956],
        content: "friend 2",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,6,30,0,0)
    },
    {
        location: [40.7718, -73.9726],
        content: "friend 3",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,7,30,0,0)
    },
    {
        location: [40.8084, -73.9438],
        content: "friend 4",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,8,30,0,0)
    }
];

var public_mark_data = [
    {
        location: [40.7989, -73.9574],
        content: "public 1",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,5,30,0,0)
    },
    {
        location: [40.7794, -73.9749],
        content: "public 2",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,6,30,0,0)
    },
    {
        location: [40.7226, -73.996],
        content: "public 3",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,7,30,0,0)
    },
    {
        location: [40.7055, -74.0117],
        content: "public 4",
        date: new Date(2019, 3, 13),
        time: new Date(2019,3,13,8,30,0,0)
    }
];

var private_mark_whole_list;
var private_mark_list;
var private_mark_group;
var friend_mark_whole_list;
var friend_mark_list;
var friend_mark_group;
var public_mark_whole_list;
var public_mark_list;
var public_mark_group;

var events = [
	{
		"name": "Java Night",
			"host": "Dr. Zhuang",
		"imgsrc": 'img/java-bordered-turquoise.png',
			"description": "Come and have fun with Java and prestigious Dr.Zhuang!",
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '7:00 pm, Today'
	},
	{
		"name": "Hackathon with Assemblies",
			"host": "Mr. Yang",
		"imgsrc": 'img/exhaustedprogrammer.jpg',
			"description": "True man only useth assemblies - Socrates",
		"addr": '234 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '9:00 pm, Tomorrow'
	},
	{
		"name": "Drink until Overflow",
			"host": "Mr. Jia",
		"imgsrc": 'img/red-white-wine.jpg',
			"description": "True man never overflowth - Plato",
		"addr": '22 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '11:00 pm, Feb 30th'
	}
];

var user = {
    "id": "wonderful zhen zhang",
    "email": "zhenzhang@gmail.com",
    "MyEventsToday": "123",
    "FriendEventsToday": "456"
};


$(function() {
	// header controllers
	(function() {
        $('#button-calendar-map').on('click', function() {
          var map_container = $('#map-container');
          if (!map_container.is(':visible')) {
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
              map_container.animate({
                height: 0
              }).promise().done(function() {
                  map_container.toggle();
                  $('#discover-container').toggle();
              });
              $('#button-calendar-map').find('i').removeClass('fa-list').addClass('fa-map-marked-alt');
          }
        });

        $('#user-profile-id').text(user['id']);
        $('#user-profile-email').text(user['email'])
        $('#user-profile-my-events').append(user['MyEventsToday']);
        $('#user-profile-friend-events').append(user['FriendEventsToday']);

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

	// discover initialize
	(function() {
        $("#item-list-location").geocomplete();        

		// location = xxx, starts_at = xxx, ends_at = xxx
		// TODO api, get events
		$('#event-list').empty().show();
		for (var i = 0; i < events.length; i++) {
			var li = $('<li/>').attr('class', 'list-group-item');
			var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

			var img = $('<div/>').attr('class', 'col-12 col-sm-6 col-md-2 px-0')
													 .attr('id','imgDiv').append(
					$('<img/>').attr('src', events[i]['imgsrc'])
								 .attr('alt', events[i]['name'])
								 .attr('class', 'rounded-circle mx-auto d-block img-fluid')
				).appendTo(container);

			var textContainer = $('<div/>').attr('class', 'col-md-6 text-sm-left').append(
					$('<span/>').attr('class', 'float-right pulse')
				).append(
					$('<label/>').attr('class', 'name lead').append(events[i]['name'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'far fa-chess-king fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['host'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['host'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-calendar-alt fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['time'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['time'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['addr'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['addr'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['phoneNum'])
				).append(
					$('<span/>').attr('class', 'text-muted small').append(events[i]['phoneNum'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-info-circle fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['description'])
				).append(
					$('<span/>').attr('class', 'text-muted small').append(events[i]['description'])
				).appendTo(container);

			var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
					$('<a/>').attr('class', 'btn btn-primary button-add-to-calendar').attr('id', 'button-add-event').append('Add to Calendar')
				).appendTo(container);

			$('#event-list').append(li);
	    }

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
	}());

	// map initialize
	(function() {
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

        friend_mark_whole_list = [];
        for(var i=0; i<friend_mark_data.length; i++) {
            var cur_marker = L.ExtraMarkers.icon({
                markerColor: 'green'
            })
            var cur_marker = L.marker(friend_mark_data[i]['location'], {"icon": cur_marker}).bindPopup(
                L.popup().setContent(make_popup_content(friend_mark_data[i]['content']))
            );
            friend_mark_whole_list.push(cur_marker);
        }
        friend_mark_list = friend_mark_whole_list.slice(0);
        friend_mark_group = L.layerGroup(friend_mark_list);

        public_mark_whole_list = [];
        for(var i=0; i<public_mark_data.length; i++) {
            var cur_marker = L.ExtraMarkers.icon({
                markerColor: 'yellow'
            })
            var cur_marker = L.marker(public_mark_data[i]['location'], {"icon": cur_marker}).bindPopup(
                L.popup().setContent(make_popup_content(public_mark_data[i]['content']))
            );
            public_mark_whole_list.push(cur_marker);
        }
        public_mark_list = public_mark_whole_list.slice(0);
        public_mark_group = L.layerGroup(public_mark_list);

        var base_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
        map = L.map('eventmap', {
            center: [init_x, init_y], 
            zoom: scale,
            layers: [
                base_layer,
                private_mark_group,
                friend_mark_group,
                public_mark_group
            ]
        });

        $("#map-location").geocomplete();
    }());

	// map controllers
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

        // checkboxes
        $("#map-private-ckbx").click(function(){
            if ($("#map-private-ckbx").hasClass('active')) {
                map.removeLayer(private_mark_group);
                $("#map-private-ckbx").removeClass('active');
            } else {
                map.addLayer(private_mark_group);
                $("#map-private-ckbx").addClass('active');
            }
        });
        $("#map-friend-ckbx").click(function(){
            if ($("#map-friend-ckbx").hasClass('active')) {
                map.removeLayer(friend_mark_group);
            	$("#map-friend-ckbx").removeClass('active');
            } else {
                map.addLayer(friend_mark_group);
            	$("#map-friend-ckbx").addClass('active');
            }
        });
        $("#map-public-ckbx").click(function(){
            if ($("#map-public-ckbx").hasClass('active')) {
                map.removeLayer(public_mark_group);
            	$("#map-public-ckbx").removeClass('active');
            } else {
                map.addLayer(public_mark_group);
            	$("#map-public-ckbx").addClass('active');
            }
        });
    }());
})

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
        $("#map-private-ckbx").hasClass('acive'),
        private_mark_group, 
        private_mark_list, 
        private_mark_whole_list, 
        private_mark_data,
        timestamp, start
        )
    console.log(private_mark_list.length);
    console.log(private_mark_group);
    friend_mark_group = reduce_layer_group_by_time(
        $("#map-friend-ckbx").hasClass('active'),
        friend_mark_group, 
        friend_mark_list, 
        friend_mark_whole_list, 
        friend_mark_data,
        timestamp, start
        )
    public_mark_group = reduce_layer_group_by_time(
        $("#map-public-ckbx").hasClass('active'),
        public_mark_group, 
        public_mark_list, 
        public_mark_whole_list, 
        public_mark_data,
        timestamp, start
        )
}