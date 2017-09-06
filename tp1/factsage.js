fonction loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = fonction(){
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("corps").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "www.factsage.com", true);
    xhttp.send();
}