var markers = {};
let dict = {};
var datatable;
var mapGoogle;
var prevousMarker;
var firstRun = true;

/**
 * Ajout d'un 'event listener' sur le boutton d'accueil pour 'refresh' la page.
 */
document.getElementById('btnAccueil').addEventListener("click", function(){window.location.reload()});


var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', 'https://secure.bixi.com/data/stations.json');
xmlhttp.onload = function() {
  if(xmlhttp.status >= 200 && xmlhttp.status < 400) {
    var myobj = JSON.parse(xmlhttp.responseText);     // Formatage du fichier reçu en objet JSON.
    var objStations = myobj.stations;                 // On récupère la portion 'station' de l'objet JSON.

    createEmptyDataTable();                           // Crée la 'dataTable', mais elle sera vide.  Ajout des lignes un peu plus loin.
    initEmptyMap();                                   // Initilisation de la map.

    let dictNom = [];
    var mapMarker;
    var infowindow = new google.maps.InfoWindow();

    /**
     * Cette portion de code permet d'aller récupérer toutes les stations
     * à l'intérieur de l'objet JSON créé plus haut.  On crée un dictionnaire
     * avec les informations nécessaires de chaque station.
     */
    $.each(myobj.stations, function(i, station) {
      let newStation = {                              // Variable temporaire pour créer un objet station qu'on ajoutera au dictionnaire ensuite.
        'id' : station.id,
        'nom' : station.s,
        'latitude' : station.la,
        'longitude' : station.lo,
        'horsService':station.m  == true ? "Oui" : "Non",
        'etatBloque' : station.b == true ? "Oui" : "Non",
        'etatSuspendu' : station.su == true ? "Oui" : "Non",
        'veloDisponible' : station.ba,
        'borneDisponible' : station.da,
        'velosIndisponibles' : station.bx,
        'bornesIndisponibles' : station.dx,
      }
      dict[newStation.nom] = newStation;              // Ajout de la station au dictionnaire.
      dictNom.push(newStation.nom);                   // Utile pour afficher tous les noms de stations dans l'autocomplete .
      
      datatable.row.add(newStation).draw();           // Ajout de la station au 'DataTable'.
      mapMarker = addMapMarker(newStation);           // Ajout d'un marqueur pour la station que l'on vient d'ajouter au dictionnaire.
      addListenerToMapMarker(infowindow, newStation, mapMarker); // Ajout également d'un 'event listener' au marqueur pour que l'on puisse cliquer dessus.
    });

    initAutoComplete(dictNom);                        // Initialisation du 'autocomplete' dans la page de la carte des stations.
  } else {
    console.log("Error connecting to the server.");
  }
};
xmlhttp.send();


/**
 * Fonction permettant d'ajouter un marqueur dans la MAP.
 * @param {*} newStation 
 */
function addMapMarker(newStation) {
  var mapMarker = new google.maps.Marker({
    position: new google.maps.LatLng(newStation.latitude, newStation.longitude),    // position (obligatoire)  : emplacement du marqueur (latitude, longitude).
    map: mapGoogle,                                                                 // map (facultatif)        : Spécifie l'objet Map sur lequel placer le marqueur.
    title: newStation.nom,                                                          // title (facultatif)      : On mouse over, affiche un tooltip.            
    animation: google.maps.Animation.DROP,                                          // animation (facultatif)  : Animation du marker.
    draggable: false,                                                               // draggable (falcultatif) : Empeche l'utilisateur de déplacer le marker.                                                          
  });

  var latLng = new google.maps.LatLng(newStation.latitude, newStation.longitude);
  markers[latLng] = mapMarker;											  // Creer le tableau avec des cles "latitueLongitude".

  return mapMarker;
}

/**
 * Fonction permettant d'ajout une écoute sur les marqueurs afin que l'utilisateur
 * puisse cliquer dessus et que les informations relatives à cette station s'affiche
 * dans le tableau de la page 'carte des stations'.
 * @param {*} infowindow 
 * @param {*} newStation 
 * @param {*} mapMarker 
 */
function addListenerToMapMarker(infowindow, newStation, mapMarker) {
  google.maps.event.addListener(mapMarker, 'click', (function(mapMarker) {
    return function() {
      // Faire 'bounce' le marker une fois lors du clique.
      mapMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ mapMarker.setAnimation(null); }, 750);
	  
	    // Lorsqu'on fait un clique sur le marqueur, les informations est actualisées.
	    actualiserTableau(newStation.nom);
    }
  })(mapMarker));
}

/**
 * Fonction permettant de céer la 'DataTable'.  Elle sera toutefois initialisée avec
 * aucune ligne.  Elles seront ajoutés lorsqu'on ira chercher les informations sur
 * le serveurs distants.
 */
function createEmptyDataTable() {
  $(document).ready(function() {
    datatable = $('#tableauDeDonnees').DataTable({
      columns: [                                                    //Les différentes colonnes désirées dans le tableau.
        { title : "ID", data : 'id' },
        { title : "Nom station", data : 'nom' },
        { title : "Vélos disponibles", data : 'veloDisponible' },
        { title : "Bornes disponibles", data : 'borneDisponible' },
        { title : "État bloqué", data : 'etatBloque' },
        { title : "État suspendu", data : 'etatSuspendu' }
      ],
      columnDefs: [                                                 //Alignement des différentes colonnes du tableau.
        { className: "dt-body-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
        { className: "dt-body-left" , "targets":[1] },              //Aligne à gauche la 2e colonne (nom des stations).
        { className: "dt-head-center" , "targets":[0,2,3,4,5] },    //Aligne au centre la 1ere colonne (ID).
        { className: "dt-head-left" , "targets":[1] }               //Aligne à gauche la 2e colonne (nom des stations).
      ]
    });
  });
};


/**
 * Fonction permettant d'initialiser la MAP dans la page de la carte des stations.
 * Les marqueurs dans la MAP seront ajoutés séparément, au moment de récupérer les
 * informations sur le serveur distant.
 */
function initEmptyMap() {
  mapGoogle = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(45.508, -73.554)
  });
};


/**
 * Fonction permettant d'initialiser le fonctionnement de l'autocomplete de la page
 * de la carte des stations.
 * @param {*} stations 
 */
function initAutoComplete(stations) {
  $( "#autocomplete" ).autocomplete({
    minLength : 0,
    source : stations,
	  select: function( event, ui ) {
      actualiserTableau(ui.item.value);
      mapGoogle.setCenter( { lat: dict[ui.item.value].latitude, lng: dict[ui.item.value].longitude } );
    }
  });
};


/**
 * Fonction permettant de mettre à jour les informations dans le tableau se trouvant
 * dans la page de la carte des stations.
 * @param {*} currentStation 
 */
function actualiserTableau(currentStation) {
  // Actualiser le contenu du tableau.
  document.getElementById("idStation").innerHTML = dict[currentStation].id;
  document.getElementById("velosDisponibles").innerHTML = dict[currentStation].veloDisponible;	
  document.getElementById("bloquee").innerHTML = dict[currentStation].etatBloque;
  document.getElementById("bornesDisponibles").innerHTML = dict[currentStation].borneDisponible;
  document.getElementById("suspendue").innerHTML = dict[currentStation].etatSuspendu;
  document.getElementById("velosIndisponibles").innerHTML = dict[currentStation].velosIndisponibles;
  document.getElementById("horsService").innerHTML = dict[currentStation].horsService;
  document.getElementById("bornesIndisponibles").innerHTML = dict[currentStation].bornesIndisponibles;

  // Pour l'affichage du titre de la station sélectionnée.
  document.getElementById("localisationSelectee").innerHTML = currentStation;
  
  // Changer la couleur de l'icone selon la valeur du conteneur.
  if(dict[currentStation].veloDisponible < 1)
    $('#velosDisponibles').removeClass('progress-bar-success').addClass('progress-bar-danger ');
  else
    $('#velosDisponibles').removeClass('progress-bar-danger').addClass('progress-bar-success ');
  
  if(dict[currentStation].etatBloque == 'Oui')
    $('#bloquee').removeClass('progress-bar-success').addClass('progress-bar-danger ');
  else
    $('#bloquee').removeClass('progress-bar-danger').addClass('progress-bar-success ');
  
  if(dict[currentStation].etatSuspendu == 'Oui')
    $('#suspendue').removeClass('progress-bar-success').addClass('progress-bar-danger ');	
  else
    $('#suspendue').removeClass('progress-bar-danger').addClass('progress-bar-success ');
  
  if(dict[currentStation].horsService == 'Oui')
    $('#horsService').removeClass('progress-bar-success').addClass('progress-bar-danger ');	
  else
    $('#horsService').removeClass('progress-bar-danger').addClass('progress-bar-success ');
  
  if(dict[currentStation].borneDisponible < 1)
    $('#bornesDisponibles').removeClass('progress-bar-success').addClass('progress-bar-danger ');
  else
    $('#bornesDisponibles').removeClass('progress-bar-danger').addClass('progress-bar-success ');
    
  // Modifier l'icone de la station selectionée.
  if(firstRun)
    firstRun = false;
  else{
    var tmpLatLng = new google.maps.LatLng(dict[prevousMarker].latitude, dict[prevousMarker].longitude);			// Revenir à l'icone par défaut.
    markers[tmpLatLng].setIcon();
  }
        
  prevousMarker = currentStation;
  var ltnLng = new google.maps.LatLng(dict[currentStation].latitude, dict[currentStation].longitude)
  changeIconMarker(ltnLng);
}


/**
 * Fonction permettant de modifier l'icone d'un marqueur dans la MAP.
 * @param {*} ltnLng 
 */
function changeIconMarker(ltnLng){
	var icon = {
    url: "/assets/markerBlue.png",
    size: new google.maps.Size(50, 50),
    scaledSize: new google.maps.Size(22, 40),
    anchor: new google.maps.Point(11, 40)
  };
  markers[ltnLng].setIcon(icon);
}
















	