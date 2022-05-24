let coordinates = {};
$(document).ready(function () {
  get_coordinates();
  renderLocation();
});

function get_coordinates() {
  var searchParams = new URLSearchParams(window.location.search);
  //     console.log(searchParams)
  if (searchParams.has("source") && searchParams.has("destination")) {
    alert("cordinates are selected");
    var source = searchParams.get("source");
    var destination = searchParams.get("destination");
    console.log(source);
    coordinates.source_lat = source.split(";")[0];
    coordinates.source_lng = source.split(";")[1];

    coordinates.destination_lat = destination.split(";")[0];
    coordinates.destination_lng = destination.split(";")[1];
  } else {
    window.history.back();
    alert("coordinates are not selected");
  }
}

function renderLocation() {
  $.ajax({
    url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lng}%2C${coordinates.source_lat}%3B${coordinates.destination_lng}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoicHJhdGhlZXJ0aCIsImEiOiJjbDMydG9oY3oxYWQwM3Bwc2Fsdno3c2UyIn0.WOShnHZ-CicyxQIjJbQzQQ`,
    type: "get",
    success: function (response) {
      let images = {
        "turn-left": "ar_left.png",
        "turn-right": "ar_right.png",
        "slight-left": "ar_slight_left.png",
        "slight-right": "ar_slight_right.png",
        straight: "ar_straight.png",
      };
      var steps = response.routes[0].legs[0].steps;
      console.log(steps);
      for (var i = 0; i < steps.length; i++) {
        let image;
        let distance = steps[i].distance;

        let instruction = steps[i].maneuver.instruction;
        console.log(instruction);
        if (instruction.includes("Turn right")) {
          image = "turn-right";
        } else if (instruction.includes("Turn left")) {
          image = "turn-left";
        }
        if (i > 0) {
          $("#scene_container").append(
            ` <a-entity gps-entity-place="latitude: ${
              steps[i].maneuver.location[1]
            }; 
            longitude: ${steps[i].maneuver.location[0]};">
            <a-image 
            name="${instruction}" 
            src="./assests/${images[image]}" 
            look-at="#step_${i - 1}" 
            scale="5 5 5"
            id="step_${i}" 
            position="0 0 0" > 
            </a-image> 
            <a-entity> 
            <a-text height="50" value="${instruction} (${distance}m)"></a-text>
            </a-entity> </a-entity> `
          );
        } else {
          $("#scene_container").append(
            ` <a-entity gps-entity-place="latitude: ${
              steps[i].maneuver.location[1]
            }; 
            longitude: ${steps[i].maneuver.location[0]};">
            <a-image 
            name="${instruction}" 
            src="./assests/${images[image]}" 
            look-at="#step_${i + 1}" 
            scale="5 5 5"
            id="step_${i}" 
            position="0 0 0" > 
            </a-image> 
            <a-entity> 
            <a-text height="50" value="${instruction} (${distance}m)"></a-text>
            </a-entity> </a-entity> `
          );
        }
      }
    },
  });
}
