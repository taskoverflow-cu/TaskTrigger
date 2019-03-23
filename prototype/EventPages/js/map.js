
// Map initialization
$(function () {

    (function (window) {
        var map = L.map('eventmap').setView([40.807537, -73.962570], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([40.807537, -73.962570]).addTo(map)
            .bindPopup('COMS6998 Event')
            .openPopup();


    }(window));

    (function(window){
        $(".header .buttons .back").click(function(){
            window.location.href = 'calendar.html';
        });
    }(window));
})
