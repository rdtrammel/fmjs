var $ = document;

function go(){
    //You can hardcode these values in a server side config file and...
    //pull them in too, this is just for the sake of on the fly testing
    var host = $.querySelector('input[name="host"]').value;
    var file = $.querySelector('input[name="file"]').value;
    var user = $.querySelector('input[name="username"]').value;
    var pass = $.querySelector('input[name="password"]').value;

    var fmjs = new FMJS({
        host : host,
        file : file,
        user : user,
        pass : pass
    });
    
    console.log(fmjs);
}




