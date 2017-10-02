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