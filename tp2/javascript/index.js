var infosDatatable = [];
var nomStations = [];
var coordonnees = [];

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
    console.log("1. Data as been retreived from server.");
    generateVariablesFromJsonObject(objStations);
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

/**
 * DataTable 
 */
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

    /*table.rows().every( function(rowIdx, tableLoop, rowLoop) {
      var cell = table.cell({row: rowIdx, column: 0}).node();
      $(cell).addClass('warning') ;
    });*/
  });
};


  /**
 * Fonction permettant l'affichage de la map Google.
 * variable infoDatatable :
 */
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
        '<h5>Latitude : ' + coordonnees[i][1] + '</h5>' +
        '<h5>Longitude : ' + coordonnees[i][2] + '</h5>';
        infowindow.setContent(content);
        infowindow.open(map,marker);

        //Faire 'bounce' le marker une fois.
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
      }
    })(marker,i));
  }
};



$( "#autocomplete" ).autocomplete({
  source: nomStations
});