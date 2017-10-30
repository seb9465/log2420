var infosDatatable = [];
var nomStations = [];
var coordonnees = [];
var markers = {};
let dict = {};
var datatable;
var mapGoogle;
var prevousMarker;		// garde le nome du dernier marqueur selectione/modifie
var firstRun = true;

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

      //let dict = {};
      let dictNom = [];
      var mapMarker;
      var infowindow = new google.maps.InfoWindow();

      $.each(myobj.stations, function(i, station) {
        let newStation = {
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
        dict[newStation.nom] = newStation;
		    dictNom.push(newStation.nom);
        
        datatable.row.add(newStation).draw();
        mapMarker = addMapMarker(newStation);
        addListenerToMapMarker(infowindow, newStation, mapMarker); 
      });
      initAutoComplete(dictNom);
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
  var latLng = new google.maps.LatLng(newStation.latitude, newStation.longitude);
  markers[latLng] = mapMarker;														//creer le tableau avec des cles "latitueLongitude" 

  return mapMarker;
}

function addListenerToMapMarker(infowindow, newStation, mapMarker) {
  google.maps.event.addListener(mapMarker, 'click', (function(mapMarker) {
    return function() {
		
      //Afficher la bulle d'informations.
      /*var content = '<h5>Nom de la station : ' + newStation.nom + '</h5>' + 
      '<h5>Vélos diponibles : ' + newStation.veloDisponible + '</h5>' +
      '<h5>Bornes disponibles : ' + newStation.borneDisponible + '</h5>';
      infowindow.setContent(content);
      infowindow.open(mapGoogle,mapMarker);*/

      //Faire 'bounce' le marker une fois.
      mapMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ mapMarker.setAnimation(null); }, 750);
	  
	  //lorsque on fait click sur le marqueur l'information est actualise
	  actualiseTable(newStation.nom);

    }
  })(mapMarker));
}

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

function initEmptyMap() {
  mapGoogle = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(45.508, -73.554)
  });
};

function initAutoComplete(stations) {
  $( "#autocomplete" ).autocomplete({
    minLength : 0,
    source : stations,
	  select: function( event, ui ) {
      actualiseTable(ui.item.value);
      mapGoogle.setCenter( { lat: dict[ui.item.value].latitude, lng: dict[ui.item.value].longitude } );
    }
  });
};

function actualiseTable(currentStation) {
					/* Actualiser le contenu du tableau. */
					document.getElementById("idStation").innerHTML = dict[currentStation].id;
					document.getElementById("velosDisponibles").innerHTML = dict[currentStation].veloDisponible;	
					document.getElementById("bloquee").innerHTML = dict[currentStation].etatBloque;
					document.getElementById("bornesDisponibles").innerHTML = dict[currentStation].borneDisponible;
					document.getElementById("suspendue").innerHTML = dict[currentStation].etatSuspendu;
					document.getElementById("velosIndisponibles").innerHTML = dict[currentStation].velosIndisponibles;
					document.getElementById("horsService").innerHTML = dict[currentStation].horsService;
          document.getElementById("bornesIndisponibles").innerHTML = dict[currentStation].bornesIndisponibles;
          /* Pour l'affichage du titre de la station sélectionnée. */
					document.getElementById("localisationSelectee").innerHTML = currentStation;
					
					/* Changer la couleur du icon selon la valeur du conteneur. */
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
            
					/* Modifier l'icone de la station selectionee. */
					if(firstRun)
						firstRun = false;
					else{
						var tmpLatLng = new google.maps.LatLng(dict[prevousMarker].latitude, dict[prevousMarker].longitude);			// revenir a l'icon par default
						markers[tmpLatLng].setIcon();
					}
									
					prevousMarker = currentStation;
					var ltnLng = new google.maps.LatLng(dict[currentStation].latitude, dict[currentStation].longitude)
					changeIconMarker(ltnLng);

}

  
	  
function changeIconMarker(ltnLng){
	var icon = {
  url: "/assets/markerBlue.png", // url,
  size: new google.maps.Size(50, 50),
  scaledSize: new google.maps.Size(22, 40),
  anchor: new google.maps.Point(11, 40)
};
	
  markers[ltnLng].setIcon(icon);
 
}
















	