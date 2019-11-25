var runner = require("child_process");

function restart(){
    var phpScriptPath = "php/restart.php";
    var argsString = "";
    runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
        if(err) console.log(err); /* log error */
        console.log( phpResponse );
    });
}

function gitpull(){
    var phpScriptPath = "php/pull.php";
    runner.exec("php " + phpScriptPath, function(err, phpResponse, stderr){
        if(err) console.log(err); /* log error */
        console.log( phpResponse );
    });
}

function gitpush(request,response){
    var phpScriptPath = "php/push.php";
    runner.exec("php " + phpScriptPath, function(err, phpResponse, stderr){
        if(err) console.log(err); /* log error */
        console.log( phpResponse );
    });
    
}

module.exports = {
    restart,
    gitpull,
    gitpush
}