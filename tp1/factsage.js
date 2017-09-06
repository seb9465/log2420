function loadDoc(){
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            document.getElementById('corpsint').innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "http://www.factsage.com", true);
    xhttp.send();
}