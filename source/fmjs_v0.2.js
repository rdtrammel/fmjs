class FMJS{

    constructor(settings){
        
        this.host = settings.host || 'localhost';
        this.file = settings.file;
        this.token;

        this.performFind = function(layout, query){
            if (!this.token){ openConnection(); return;}
            let url = `https://${this.host}/fmi/data/v1/databases/${this.file}/layouts/${layout}/_find`;
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', `Bearer ${this.token}`);
            http.onreadystatechange = function() {
                if(http.readyState == 4){
                    if(http.status == 200) {
                        var json = JSON.parse(http.responseText);
                        json.response.data;
                        closeConnection();
                        console.table(json.response.data);
                    } else {
                        return `Http status: [${http.status}] ${http.statusText}`;
                    }
                }
            }
            http.send(JSON.stringify(query));
        }

    }

    openConnection(thenCallFunction){
        console.log(thenCallFunction);
            /*if (!validateFields()){
                console.log("The Host, File, Username, and Password are missing,");
                return "The Host, File, Username, and/or Password are missing.";
            }else{;
                let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions`;
                var http = new XMLHttpRequest();
                var body = '{}';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Authorization', `Basic ${btoa(settings.user+':'+settings.pass)}`);
                http.onreadystatechange = function() {
                    if(http.readyState == 4){
                        if ( http.status == 200 ) {
                            var json = JSON.parse(http.responseText);
                            this.token = json.response.token;
                            thenCallFunction;
                        } else {
                            console.log(`[Error: ${http.status}] Unable to connect to the file ${this.file} on the host https://${this.host}`);
                        }
                    }
                }   
                http.send(body);
            }*/
        }

    closeConnection(){
        if (!this.token) { console.log('Err - No token found.' ); return;}
        let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions/${settings.token}`;
        var http = new XMLHttpRequest();
        http.open('DELETE', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            if(http.readyState == 4){
                if(http.status == 200) {
                    var json = JSON.parse(http.responseText);
                    this.token = "";
                }else{
                    console.log(`[Error: ${http.status}] Network Connection failed when attempting to close the file`);
                }
            }
        }
        http.send();
    }

}