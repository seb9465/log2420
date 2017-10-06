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
    } else {
      console.log("Error connecting to the server.");
    }
  };
  xmlhttp.send();

var a = [];
var nomStations = [];
function hello() {
  for(var i = 0 ; i < obj.length ; i++) {
    var temp = [];
    temp.push(obj[i].id);     //ID
    temp.push(obj[i].s);      //Nom station
    nomStations.push(obj[i].s);
    temp.push(obj[i].ba);     //Vélos disponibles
    temp.push(obj[i].da);     //Bornes disponibles

    var etatBloque = "";
    if(obj[i].b == true)      //État bloqué
      etatBloque = "Oui";
    else
      etatBloque = "Non";
    temp.push(etatBloque);     

    var etatSuspendu = "";
    if(obj[i].su == true)     //État suspendu
      etatSuspendu = "Oui";
    else
      etatSuspendu = "Non";
    temp.push(etatSuspendu);    

    a.push(temp);
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
        ]
    } );
  } );
};

 /**
   * Mettre une variable a la place de la liste de mot.
   * Il faudra aller chercher les mots-cles dans la banque de donnees.
   */
  $( "#autocomplete" ).autocomplete({
    source: nomStations
  });