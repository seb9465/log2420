/**
 * Fonction permettant l'affichage de la map Google.
 */
function initMap() {
    var uluru = {lat: 45.5087, lng: -73.554};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    }); 
  }


  /**
   * Mettre une variable a la place de la liste de mot.
   * Il faudra aller chercher les mots-cles dans la banque de donnees.
   */
  $( "#autocomplete" ).autocomplete({
    source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
  });

var obj;
var btn = document.getElementById('secondTab');

//btn.addEventListener("click", function() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://secure.bixi.com/data/stations.json');
  xmlhttp.onload = function() {
    if(xmlhttp.status >= 200 && xmlhttp.status < 400) {
      var myobj = JSON.parse(xmlhttp.responseText);
      obj = myobj.stations;
      console.log(obj);
    } else {
      console.log("Error connecting to the server.");
    }
  };
  xmlhttp.send();
//});

$(document).ready(function() {
  $('#example').dataTable( {
      "data": obj,
      "columns": [
          { "data":  "s" }
      ]
  } );
} );
  