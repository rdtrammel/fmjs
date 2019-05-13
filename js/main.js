function go(){
    //You can hardcode these values in a server side config file and...
    //pull them in too, this is just for the sake of on the fly testing
    let host = document.querySelector('input[name="host"]').value;
    let file = document.querySelector('input[name="file"]').value;
    let user = document.querySelector('input[name="username"]').value;
    let pass = document.querySelector('input[name="password"]').value;

    let fmjs = new FMJS();

    //fmjs.performFind("Employees", {query : [{"fullName":"*"}]});

}




