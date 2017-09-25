/* Fait appel à une requette qui charge la page (change le contenu du tableau corp) */
function loadDoc(url){
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('corps').innerHTML = this.responseText;
            document.getElementById('reqGeneral').style.color='black';
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

	/* Fait l'appel à l'eveniment click afin d'appeler la fonction loadDoc qui affiche la page */
	
	document.getElementById('reqReaction').addEventListener("click", function(){loadDoc('fs_reaction.php')});
    document.getElementById('reqGeneral').addEventListener("click", function() {loadDoc('fs_general.php')});