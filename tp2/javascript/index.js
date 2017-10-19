var infosDatatable = [];
var nomStations = [];
var coordonnees = [];
var datatable;
var mapGoogle;


/**
   * Fonction permettant d'aller récupérer les informations sur le site
   * contenant les informations sur les stations BIXI.
   */
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://secure.bixi.com/data/stations.json');
  xmlhttp.onload = function() {
    if(xmlhttp.status >= 200 && xmlhttp.status < 400) {
      var objStations;
      var myobj = JSON.parse(xmlhttp.responseText);
      objStations = myobj.stations;
      //generateVariablesFromJsonObject(objStations);
      createEmptyDataTable();
      initEmptyMap();

      let dict = {};
      var mapMarker;
      var infowindow = new google.maps.InfoWindow();

      $.each(myobj.stations, function(i, station) {
        let newStation = {
          'id' : station.id,
          'nom' : station.s,
          'latitude' : station.la,
          'longitude' : station.lo,
          'etatBloque' : station.b == true ? "Oui" : "Non",
          'etatSuspendu' : station.su == true ? "Oui" : "Non",
          'veloDisponible' : station.ba,
          'borneDisponible' : station.da
        }
        dict[newStation.nom] = newStation;

        datatable.row.add(newStation).draw();
        mapMarker = addMapMarker(newStation);
        addListenerToMapMarker(infowindow, newStation, mapMarker);
        
      });
      initAutoComplete(dict);
    } else {
      console.log("Error connecting to the server.");
    }
  };
  xmlhttp.send();

function addMapMarker(newStation) {
  var mapMarker = new google.maps.Marker({
    position: new google.maps.LatLng(newStation.latitude, newStation.longitude),    //position (obligatoire) : emplacement du marqueur (latitude, longitude).
    map: mapGoogle,                                                                 //map (facultatif) : Spécifie l'objet Map sur lequel placer le marqueur.
    title: newStation.nom,                                                          //title (facultatif) : On mouse over, affiche un tooltip.            
    animation: google.maps.Animation.DROP,                                          //animation (facultatif) : Animation du marker.
    draggable: false,                                                               //draggable (falcultatif) : Empeche l'utilisateur de déplacer le marker.                                                          
  });
  return mapMarker;
}


function addListenerToMapMarker(infowindow, newStation, mapMarker) {
  google.maps.event.addListener(mapMarker, 'click', (function(mapMarker) {
    return function() {
      //Afficher la bulle d'informations.
      var content = '<h5>Nom de la station : ' + newStation.nom + '</h5>' + 
      '<h5>Vélos diponibles : ' + newStation.veloDisponible + '</h5>' +
      '<h5>Bornes disponibles : ' + newStation.borneDisponible + '</h5>';
      infowindow.setContent(content);
      infowindow.open(mapGoogle,mapMarker);

      //Faire 'bounce' le marker une fois.
      mapMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ mapMarker.setAnimation(null); }, 750);
    }
  })(mapMarker));
}


/**
 * Variable dataTable :
 * [...][0] = ID.
 * [...][1] = Nom de la station.
 * [...][2] = Nombre de vélos disponibles.
 * [...][3] = Nombre de bornes disponibles.
 * [...][4] = État bloqué (bool).
 * [...][5] = État suspendu (bool).
 * 
 * Variable coordonnees :
 * [...][0] = Nom de la station.
 * [...][1] = Latitude de la station.
 * [...][2] = Longitude de la station.
 */
/*
function generateVariablesFromJsonObject(object) {
  var tempInfoDatatable = [];
  var tempCoordonnees = [];
  var etatBloque = "";
  var etatSuspendu = "";
  for(var i = 0 ; i < object.length ; i++) {
    tempInfoDatatable = [];
    tempCoordonnees = [];

    // ----------- Creation d'un tableau contenant les informations pour la DATATABLE -----------
    tempInfoDatatable.push(object[i].id);        //ID
    tempInfoDatatable.push(object[i].s);         //Nom station
    tempInfoDatatable.push(object[i].ba);        //Vélos disponibles
    tempInfoDatatable.push(object[i].da);        //Bornes disponibles

    etatBloque = object[i].b == true ? "Oui" : "Non";//État bloqué                     
    tempInfoDatatable.push(etatBloque);     

    etatSuspendu = object[i].su == true ? "Oui" : "Non";//État suspendu
    tempInfoDatatable.push(etatSuspendu);   

    // ----------- Creation d'un tableau contenant les informations pour la MAP -----------
    tempCoordonnees.push(object[i].s);           //Nom de stations
    tempCoordonnees.push(object[i].la);          //Latitude
    tempCoordonnees.push(object[i].lo);          //Longitude 

    //Variables globales.
    infosDatatable.push(tempInfoDatatable);   //push du tableau contenant seulement les informations désirées pour la liste des stations (DATATABLE).
    coordonnees.push(tempCoordonnees);        //push du tableau contenant seulement les informations désirées pour les coordonnes (MAPS).
    nomStations.push(object[i].s);       //Nom de stations pour le AutoComplete.
  }
};
*/

/**
 * DataTable 
 */
/*
function createDataTable() {
  $(document).ready(function() {
    var table = $('#example').DataTable( {
        data: infosDatatable,
        columns: [                              //Les différentes colonnes désirées dans le tableau.
          { title : "ID" },
          { title : "Nom station" },
          { title : "Vélos disponibles" },
          { title : "Bornes disponibles" },
          { title : "État bloqué" },
          { title : "État suspendu" }
        ],
        columnDefs: [                           //Alignement des différentes colonnes du tableau.
          { className: "dt-body-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
          { className: "dt-body-left" , "targets":[1] },              //Aligne à gauche la 2e colonne (nom des stations).
          { className: "dt-head-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
          { className: "dt-head-left" , "targets":[1] }               //Aligne à gauche la 2e colonne (nom des stations).
        ]
    } );
  });
};
*/

function createEmptyDataTable() {
  $(document).ready(function() {
    datatable = $('#example').DataTable({
      columns: [                              //Les différentes colonnes désirées dans le tableau.
        { title : "ID", data : 'id' },
        { title : "Nom station", data : 'nom' },
        { title : "Vélos disponibles", data : 'veloDisponible' },
        { title : "Bornes disponibles", data : 'borneDisponible' },
        { title : "État bloqué", data : 'etatBloque' },
        { title : "État suspendu", data : 'etatSuspendu' }
      ],
      columnDefs: [                           //Alignement des différentes colonnes du tableau.
        { className: "dt-body-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
        { className: "dt-body-left" , "targets":[1] },              //Aligne à gauche la 2e colonne (nom des stations).
        { className: "dt-head-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
        { className: "dt-head-left" , "targets":[1] }               //Aligne à gauche la 2e colonne (nom des stations).
      ]
    });
  });
  
};


  /**
 * Fonction permettant l'affichage de la map Google.
 * variable infoDatatable :
 */
/*
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(coordonnees[0][1], coordonnees[0][2])
  });
  
  var marker, i, infowindow = new google.maps.InfoWindow();
  for(i = 0 ; i < coordonnees.length ; i++) {
    // Permet d'afficher plusieurs 'marker' dans la map.
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(coordonnees[i][1], coordonnees[i][2]),   //position (obligatoire) : emplacement du marqueur (latitude, longitude).
      map: map,                                                                 //map (facultatif) : Spécifie l'objet Map sur lequel placer le marqueur.
      title: coordonnees[i][0],                                                 //title (facultatif) : On mouse over, affiche un tooltip.            
      animation: google.maps.Animation.DROP,                                    //animation (facultatif) : Animation du marker.
      draggable: false,                                                         //draggable (falcultatif) : Empeche l'utilisateur de déplacer le marker.                                                          
    }); 

    //Permet d'afficher une bulle d'informations lorsqu'on clique sur un marker.
    google.maps.event.addListener(marker, 'click', (function(marker,i) {
      return function() {
        //Afficher la bulle d'informations.
        var content = '<h5>Nom de la station : ' + coordonnees[i][0] + '</h5>' + 
        '<h5>Vélos diponibles : ' + infosDatatable[i][2] + '</h5>' +
        '<h5>Bornes disponibles : ' + infosDatatable[i][3] + '</h5>';
        infowindow.setContent(content);
        infowindow.open(map,marker);

        //Faire 'bounce' le marker une fois.
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
      }
    })(marker,i));
  }
};
*/


function initEmptyMap() {
  mapGoogle = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(45.508, -73.554)
  });
};

function initAutoComplete(stations) {
  $( "#autocomplete" ).autocomplete({
    source : stations
  });
};