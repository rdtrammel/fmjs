document.querySelector("button").addEventListener('click',()=>{
    let fm = new FMJS({
        host : "",
        file : "",
        user : "",
        pass : ""
    });

    let find = {
        query : [
            {"field1" : "value1"},
            {"field2" : "value2"},
            {"etc" : "etc"}
        ]
    }
    fm.performFind("layout", find);
});