document.querySelector("button").addEventListener('click',()=>{
    let fm = new FMJS({
        host : "",
        file : "",
        user : "",
        pass : ""
    });

    let find = {
        query : [
            {"is_active" : "1"}
        ]
    }

    fm.performFind("Sites", find);

});