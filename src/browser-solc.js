require('es6-shim')
var solc = require('solc/wrapper')

function loadScript(name, url, callback){
    var script = document.getElementById("script-" + name);
    if (script != null) {
        script.parentElement.removeChild(script);
    }

    script = document.createElement("script")
    script.type = "text/javascript";
    script.setAttribute("id", "script-" + name);

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadSolcJson(url, callback) {
    delete window.Module
    // NOTE: workaround some browsers
    window.Module = undefined
    // var url = "https://ethereum.github.io/solc-bin/bin/" + version;
    loadScript("", url, function() {
        var compiler = solc(window.Module);
        callback(compiler);
    });
}


module.exports = {
    'loadSolcJson':loadSolcJson
};
