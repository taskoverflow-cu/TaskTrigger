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


$(function () {
    (function(){
        $('.datepicker').datetimepicker({
            format: 'DD/MM/YYYY'
        });
        $('.timepicker').datetimepicker({
            format: 'hh/mm/ss'
        });
    }());

    // map initialization
    (function (window) {
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
        });        
    }(window));

    // buttons in header
    (function(window){
        // time ranges
        $("#date-start").datetimepicker({
            format: 'DD/MM/YYYY',
            onSelect: function(dateText, inst) {
                reduce_all_layer_group_by_time(dateText, null, true, true);
            }
        });
        $("#time-start").datetimepicker({
            format: 'hh/mm/ss',
            onSelect: function(timeText, inst) {
                reduce_all_layer_group_by_time(null, timeText, false, true);
            }
        });
        $("#date-end").datetimepicker({
            format: 'DD/MM/YYYY',
            onSelect: function(dateText, inst) {
                reduce_all_layer_group_by_time(dateTxte, null, true, false);
            }
        });
        $("#time-end").datetimepicker({
            format: 'hh/mm/ss',
            onSelect: function(timeText, inst) {
                reduce_all_layer_group_by_time(null, timeText, false, false);
            }
        });

        // checkboxes
        $("#private-ckbx").click(function(){
            if ($("#private-ckbx").prop('checked')) {
                console.log(private_mark_group);
                map.addLayer(private_mark_group);
            } else {
                console.log(private_mark_group);
                map.removeLayer(private_mark_group);
            }
        });

        // back to calendar
        $(".header .buttons .back").click(function(){
            window.location.href = 'calendar.html';
        });
    }(window));
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
function reduce_layer_group_by_time(visible, group_layer, mark_list, whole_list, mark_data, new_date, new_time, start_check) {
    map.removeLayer(group_layer);
    var timestamp, cur_timestamp;
    var j=0;
    if (visible) {
        for (var i=0; i<whole_list.length; i++) {
            if (new_date != null && new_time == null) {
                timestamp = new_date.getTime();
                cur_timestamp = mark_data[i]['date'].getTime();
            } else if (new_date == null && new_time != null){
                timestamp = new_time.getTime();
                cur_timestamp = mark_data[i]['time'].getTime();
            } else if (new_date != null && new_time != null) {
                timestamp = new_date.getTime() + new_time.getTime();
                cur_timestamp = mark_data[i]['date'].getTime() + mark_data[i]['time'].getTime();
            }
            j += check_timestamp_valid(mark_list, j, whole_list, i, cur_timestamp, timestamp, start_check);
        }
    }
    console.log(mark_list.length);
    group_layer = L.layerGroup(mark_list);
    map.addLayer(group_layer);
    return group_layer;
}


function reduce_all_layer_group_by_time(new_date, new_time, flag, start) {
    private_mark_group = reduce_layer_group_by_time(
        $("#private-ckbx").prop('checked'),
        private_mark_group, 
        private_mark_list, 
        private_mark_whole_list, 
        private_mark_data,
        new_date, new_time, flag, start
        )
}