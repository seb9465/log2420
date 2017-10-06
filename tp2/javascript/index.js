var a = [];
var nomStations = [];

var coordonnees = [];

/**
   * Fonction permettant d'aller récupérer les informations sur le site
   * contenant les informations sur les stations BIXI.
   */
  var obj;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://secure.bixi.com/data/stations.json');
  xmlhttp.onload = function() {
    if(xmlhttp.status >= 200 && xmlhttp.status < 400) {
      var myobj = JSON.parse(xmlhttp.responseText);
      console.log("1. Data as been retreived from server.");
      obj = myobj.stations;
      hello();
      console.log("2. Data has been parse and placed in variables.");
      hi();
      console.log("3. Data has been put in the DataTables.");
      initMap();
      console.log("4. Init map.");
    } else {
      console.log("Error connecting to the server.");
    }
  };
  xmlhttp.send();


function hello() {
  var temp = [];
  var tempCoordonnees = [];
  var etatBloque = "";
  for(var i = 0 ; i < obj.length ; i++) {
    temp = [];
    tempCoordonnees = [];

    temp.push(obj[i].id);             //ID
    temp.push(obj[i].s);              //Nom station
    temp.push(obj[i].ba);             //Vélos disponibles
    temp.push(obj[i].da);             //Bornes disponibles

    etatBloque = "";
    if(obj[i].b == true)              //État bloqué
      etatBloque = "Oui";
    else
      etatBloque = "Non";
    temp.push(etatBloque);     

    var etatSuspendu = "";
    if(obj[i].su == true)             //État suspendu
      etatSuspendu = "Oui";
    else
      etatSuspendu = "Non";
    temp.push(etatSuspendu);   

    nomStations.push(obj[i].s);       //Nom de stations

    tempCoordonnees.push(obj[i].s);   //Nom de stations
    tempCoordonnees.push(obj[i].la);  //Latitude
    tempCoordonnees.push(obj[i].lo);  //Longitude 

    a.push(temp);
    coordonnees.push(tempCoordonnees);
  }
};

function hi() {
  $(document).ready(function() {
    $('#example').DataTable( {
        data: a,
        columns: [
          { title : "ID" },
          { title : "Nom station" },
          { title : "Vélos disponibles" },
          { title : "Bornes disponibles" },
          { title : "État bloqué" },
          { title : "État suspendu" }
        ],
        columnDefs: [
          { className: "dt-body-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
          { className: "dt-body-left" , "targets":[1] },              //Aligne à gauche la 2e colonne (nom des stations).
          { className: "dt-head-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
          { className: "dt-head-left" , "targets":[1] }               //Aligne à gauche la 2e colonne (nom des stations).
        ]
    } );
  } );
};


  /**
 * Fonction permettant l'affichage de la map Google.
 */
function initMap() {
  var uluru = {lat: 45.5087, lng: -73.554};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });

  
  var marker, i;
  var infowindow = new google.maps.InfoWindow();
  for(i = 0 ; i < coordonnees.length ; i++) {
    // Permet d'afficher plusieurs 'marker' dans la map.
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(coordonnees[i][1], coordonnees[i][2]),
      map: map
    }); 

    //Permet d'afficher une bulle d'information lorsqu'on clique sur un marker.
    google.maps.event.addListener(marker, 'click', (function(marker,i) {
      return function() {
        infowindow.setContent(coordonnees[i][0]);
        infowindow.open(map,marker);
      }
    })(marker,i));
  }
};




$( "#autocomplete" ).autocomplete({
  source: nomStations
});