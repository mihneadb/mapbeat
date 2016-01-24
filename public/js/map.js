var map;

var myLatLng = {lat: 44.4268, lng: 26.1025};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 12
    });


    var markers = [];

    $.getJSON('/beats/', function (data) {
        $.each(data, function (id, beat) {
            var marker = new google.maps.Marker({
                position: beat,
                map: map,
                title: id,
            });
            markers.push(marker);
        });

        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }

        if (markers.length) {
            map.fitBounds(bounds);
        }

    });

}

initMap();

