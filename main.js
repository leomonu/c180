// 13.028641818876078, 77.65504717856643
var latitude;
var longitude;

// to
var destination

mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhdGhlZXJ0aCIsImEiOiJjbDMydG9oY3oxYWQwM3Bwc2Fsdno3c2UyIn0.WOShnHZ-CicyxQIjJbQzQQ";

$(document).ready(function(){
  alert("allow location")
  initGeolocation()
})

$(function(){
  $("#navigate-button").click(function(){
    window.location.href = `ar_navigation.html?source=${latitude};${longitude}&destination=${destination.lat};${destination.lng}`
  })
})

function initGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position);
  } else {
    alert("sorry , your brower does not support geolocation");
  }
}

function position(e) {
  // console.log(e);
  longitude = e.coords.longitude;
  latitude = e.coords.latitude;

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/navigation-night-v1",
    center: [longitude, latitude],
    zoom: 16,
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );
  map.addControl(
    new MapboxDirections({ accessToken: mapboxgl.accessToken }),
    "top-left"
  );
  map.on("click",function(el){
    // console.log(e)
    destination=el.lngLat
    console.log(destination)
  })
}
