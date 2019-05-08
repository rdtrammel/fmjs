class FMJS{

    constructor(settings){
        
        this.host = settings.host || 'localhost';
        this.file = settings.file;
        this.auth = btoa(`${settings.user}:${settings.pass}`);
        this.token;

        this.openConnection = function(callback){
            if (!validateFields()){
                console.log("The Host, File, Username, and Password are missing,");
                return "The Host, File, Username, and/or Password are missing.";
            }else{;
                let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions`;
                var http = new XMLHttpRequest();
                var body = '{}';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Authorization', `Basic ${this.auth}`);
                http.onreadystatechange = function() {
                    if(http.readyState == 4 && http.status == 200) {
                        var json = JSON.parse(http.responseText);
                        this.token = json.response.token;
                        this.auth = "";
                        callback;
                    }
                }
                http.send(body);
            }
        }

        this.closeConnection = function(){
            if (!settings.token) { console.log('Err - No token found.' ); return;}
            let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions/${settings.token}`;
            var http = new XMLHttpRequest();
            http.open('DELETE', url, true);
            http.setRequestHeader('Content-type', 'application/json');
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    var json = JSON.parse(http.responseText);
                    settings.token = "";
                }
            }
            http.send();
        }

        this.performFind = function(layout, query){
            if (!this.token){
                openConnection(performFind(layout, query));
            }
            let url = `https://${this.host}/fmi/data/v1/databases/${this.file}/layouts/${layout}/_find`;
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', `Bearer ${this.token}`);
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    var json = JSON.parse(http.responseText);
                    json.response.data;
                    callback(json.response.data);
                    console.log("Fetch Complete");
                    closeConnection();
                }
            }
            http.send(JSON.stringify(settings.query));
        }

        var performFind = function(layout, query){
            return this.performFind(layout, query);
        }
    }
}



function findRecords(layout, query, callback){
    settings.layout = layout;
    settings.query = query;
    //Pass the function you want to run to process the results of the data fetch
    settings.callback = callback;
    openConnection();
}