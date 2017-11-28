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
  /**
   * Définition de la variable définissant un observateur.
   * Contient les fonctions suivantes :
   *  -> addObserver 
   *     Permet d'ajouter un observateur de la liste.
   *  -> removeObserver
   *     Permet de supprimer une observateur de la liste.
   *  -> notifyObserver
   *     Permet de faire une mise à jour de nos composants.
   */
  var Observable = {
    observers:[] ,
    lastId: 0 ,
    addObserver: function(observer) {
      this.observers.push({callback:observer, id: this.lastId++})
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
  
  /** 
   * Ajout d'un obervateur avec le passage de la fonction 'updateAll' en paramètre.
   * C'est cette fonction qui sera appelée lorsque l'observateur sera notifié.
   */
  $(function(){
    Observable.addObserver(updateAll)
  });
  
  /**
   * Fonction permettant de mettre à jour à l'écran les composants.
   */
  function updateAll(tempInterieur, chauf){
    var pourcentage = tempInterieur + 50;
    $("#barreAffichageTemperature").css('height', pourcentage + '%');
    $("#tempIndicator").text(parseInt(pourcentage-50, 10));

    document.getElementById("dataTempExt").innerHTML = temperatureExterieure;
    document.getElementById("dataChauf").innerHTML = chauffage ? "Active" : "Inactive";
    document.getElementById("dataChauf").style.backgroundColor = chauffage ? "red" : "lightgrey";
  }
  
  /**
   * Rêgle l'intervalle à laquelle la fonction 'ticTac' sera appelée ainsi
   * que les notifications à l'observateur.
   */
  setInterval(() => {
    ticTac();
    Observable.notifyObserver();
  }, intervalleTemps);  
} );
