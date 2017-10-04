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


/*
$.ajax({
  type: "GET",
  url: "https://secure.bixi.com/data/stations.json",
  success: function(result)
  {
  console.log(result);
  
  obj = result;
  }
  });
  */

  document.getElementById('secondTab').addEventListener("click", function(){loadJSON()});

  function loadJSON() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            //document.getElementById("demo").innerHTML = myObj.name;
        }
    };
    xmlhttp.open("GET", "https://secure.bixi.com/data/stations.json", true);
    xmlhttp.send();
  }


$(document).ready(function() {
  $('#example').DataTable( {
      //"ajax": "https://secure.bixi.com/data/stations.json",
      data:obj,
      columns: [
          { "stations": "id"},
          { "stations": "s" },
          { "stations": "b" }
      ]
  } );
} );
  