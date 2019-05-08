var $ = document;

function go(){
    var host = $.querySelector('input[name="host"]').value;
    var file = $.querySelector('input[name="file"]').value;
    var user = $.querySelector('input[name="username"]').value;
    var pass = $.querySelector('input[name="password"]').value;
    if ( host && file && user && pass ) { 
        var fmjs = new FMJS({
            host : host,
            file : file,
            user : user,
            pass : pass
        });
        
    } else {
        console.log("Please makesure that you fill out all of the required fields");
    }
    
}




