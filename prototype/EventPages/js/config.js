var PRIVATE_COLOR = "#247699";
var FRIEND_COLOR = "#259652";
var PUBLIC_COLOR = "#95a52c";
var apigClient = apigClientFactory.newClient();
var DEFAULT_MAP_CENTER = [40.757871, -73.985606];
var DEFAULT_RADIUS = 5;
var DEFAULT_EVENT_AVATAR = 'img/default_event.png';
var DEFAULT_USER_AVATAR = './img/default_avatar.png';
var DEFAULT_DISCOVER = {
    // "user_id": user['user_id'],      // Only used with visibility 1/2
    // "visibility": "4",    // must
    // "time_leftbound":  "1557111500",
    // "time_rightbound": "1557119000",
    // "event_location": "string",
    // "longitude": "-70.5",
    // "latitude": "40.40",
    // "radius": "100000",        // must appear with coordinates, default=3
    // "event_name": "string",
    // "event_keywords": "string",
    "offset": 0,              // must
    "limit": 9999              // must
}  

function ts_to_datetime(ts) {
    if (ts == null) return 0;
    return new Date(parseInt(ts)*1000);
}

function datetime_to_ts(datetime) {
    if (datetime == null) return 0;
    return datetime/1000;
}

function reformat_datetime(d) {
    return d.getFullYear() + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}
