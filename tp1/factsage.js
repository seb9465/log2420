function loadDoc(){
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('corps').innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "fs_general.php", true);
    xhttp.send();
}