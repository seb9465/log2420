var infosDatatable = [];
var nomStations = [];
var coordonnees = [];

/**
   * Fonction permettant d'aller récupérer les informations sur le site
   * contenant les informations sur les stations BIXI.
   */
var objStations;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', 'https://secure.bixi.com/data/stations.json');
xmlhttp.onload = function() {
  if(xmlhttp.status >= 200 && xmlhttp.status < 400) {
    var myobj = JSON.parse(xmlhttp.responseText);
    objStations = myobj.stations;
    console.log("1. Data as been retreived from server.");
    generateVariablesFromJsonObject();
    console.log("2. Data has been parse and placed in variables.");
    createDataTable();
    console.log("3. Data has been put in the DataTables.");
    initMap();
    console.log("4. Init map.");
  } else {
    console.log("Error connecting to the server.");
  }
};
xmlhttp.send();


function generateVariablesFromJsonObject() {
  var tempInfoDatatable = [];
  var tempCoordonnees = [];
  var etatBloque = "";
  for(var i = 0 ; i < objStations.length ; i++) {
    tempInfoDatatable = [];
    tempCoordonnees = [];

    // ----------- Creation d'un tableau contenant les informations pour la DATATABLE -----------
    tempInfoDatatable.push(objStations[i].id);        //ID
    tempInfoDatatable.push(objStations[i].s);         //Nom station
    tempInfoDatatable.push(objStations[i].ba);        //Vélos disponibles
    tempInfoDatatable.push(objStations[i].da);        //Bornes disponibles

    etatBloque = "";
    if(objStations[i].b == true)                      //État bloqué
      etatBloque = "Oui";
    else
      etatBloque = "Non";
    tempInfoDatatable.push(etatBloque);     

    var etatSuspendu = "";
    if(objStations[i].su == true)                     //État suspendu
      etatSuspendu = "Oui";
    else
      etatSuspendu = "Non";
    tempInfoDatatable.push(etatSuspendu);   

    // ----------- Creation d'un tableau contenant les informations pour la MAP -----------
    tempCoordonnees.push(objStations[i].s);           //Nom de stations
    tempCoordonnees.push(objStations[i].la);          //Latitude
    tempCoordonnees.push(objStations[i].lo);          //Longitude 

    //Variables globales.
    infosDatatable.push(tempInfoDatatable);   //push du tableau contenant seulement les informations désirées pour la liste des stations (DATATABLE).
    coordonnees.push(tempCoordonnees);        //push du tableau contenant seulement les informations désirées pour les coordonnes (MAPS).
    nomStations.push(objStations[i].s);       //Nom de stations pour le AutoComplete.
  }
};


function createDataTable() {
  $(document).ready(function() {
    $('#example').DataTable( {
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
  } );
};


  /**
 * Fonction permettant l'affichage de la map Google.
 */
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: new google.maps.LatLng(coordonnees[0][1], coordonnees[0][2])
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