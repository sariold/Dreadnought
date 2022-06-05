function showHelp() {
    var o = document.getElementById('help');
    if (o.style.display === 'none') {
        o.style.display = 'block';
    } else {
        o.style.display = 'none';
    }
}

function screenSize() {
    var warning = document.getElementById('redWarning');
    setInterval(() => {
        if (window.innerWidth < 1000 || window.innerHeight < 720) {
            warning.style.display = 'block';
        }
        else {
            warning.style.display = 'none';
        } 
    }, 100);
}

window.onload(screenSize());
