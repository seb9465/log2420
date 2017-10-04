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
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        obj = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
xmlhttp.send();
  

  //obj = JSON.stringify("data/stations.json");
$(document).ready(function() {
  $('#example').DataTable( {
      "data": "data/stations.json",
      "columns": [
          { "stations": "s" }
      ]
  } );
} );
  