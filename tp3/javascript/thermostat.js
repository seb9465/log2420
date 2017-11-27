/* Extrait les valeurs produites dans la page Web et par le simulateur
 * et déclanche l'affichage des valeurs dans la page
*/


/*Code jquery qui affiche un glisseur dans le conteneur ayant
 *l'identifiant #thermostat, qui initalise sa position et ses valeurs
 *par d�faut et qui affiche la valeur s�lectionn�e dans un conteneur
 *ayant l'identifiant #valeurThermostat
 *
 *Pour d�marrer le chauffage, il faut cliquer le curseur de d�filement
 */
/*********************Ne pas modifier***********************/
 $(document).ready(function() {
  $("#thermostat").slider(
  {
    orientation: 'vertical',
    max: 40 ,
    value:temperatureThermostat,
    min: -10 ,
    step: 1
  });
  $("#thermostat").slider({
    change: function(event, ui) {
        $("#tdValeurThermostat").text(ui.value);
    }
  });
});
/*********************Ne pas modifier***********************/


$( function() {
  var Observable = {
    observers:[] ,
    lastId: -1 ,
    addObserver: function(observer) {
      this.observers.push({callback:observer, id: ++this.lastId})
    } ,
    removeObserver: function(observer) {
      var index = this.observers.indexOf(observer)
      if(~index) {
        this.observers.splice(index,1)
      }
    } ,
    notifyObserver: function() {
      this.observers.forEach(obs => obs.callback(temperatureInterieure, chauffage));
    }
  }
  
  
  $(function(){
    console.log("Ajout d'un observer.")
    Observable.addObserver(updateAll)
  });
  
  function updateAll(tempInterieur, chauf){
    var pourcentage = tempInterieur + 50;
    $("#barreAffichageTemperature").css('height', pourcentage+'%' );
    
    document.getElementById("dataTempExt").innerHTML = temperatureExterieure;
    
    if(chauffage == true) {
      document.getElementById("dataChauf").innerHTML = "Active";
      document.getElementById("dataChauf").style.backgroundColor = "red";
    } else {
      document.getElementById("dataChauf").innerHTML = "Inactive";
      document.getElementById("dataChauf").style.backgroundColor = "white";
    }
  }
  
  setInterval(() => {
    ticTac();
    Observable.notifyObserver();
  }, intervalleTemps);  
} );
