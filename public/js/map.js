
mapboxgl.accessToken = mapToken;//mapToken access from show.ejs

const map = new mapboxgl.Map({//create new map
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [longitude, latitude] of map. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(listing.geometry.coordinates) //listing.geomrty.coordinate
    .setPopup( 
        new mapboxgl.Popup({offset: 25})
        .setHTML( `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);