class FMJS{

    constructor(settings){
        this.host = settings.host;
        this.file = settings.file;
        this.auth = btoa(`${settings.user}:${settings.pass}`);
    }

    performFind(layout, query){
        if (!this.token){
            this.openConnection(layout, query);
        } else {
            console.log("Finding Records.");
            let url = `https://${this.host}/fmi/data/v1/databases/${this.file}/layouts/${layout}/_find`;
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', `Bearer ${this.token}`);
            http.onreadystatechange = function() {
                console.log(`Get Records - Ready State: [${http.readyState}] Status: [${http.status}]`);
                if(http.readyState == 4 && http.status == 200) {
                    var json = JSON.parse(http.responseText);
                    json.response.data;
                    settings.callback(json.response.data);
                    console.log("Fetch Complete");
                    closeConnection();
                }
            }
            http.send(JSON.stringify(settings.query));
            this.closeConnection();
        }
    }

    openConnection(){
        console.log("Connecting to FileMaker");
        let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions`;
        let http = new XMLHttpRequest();
        let body = '{}';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('Authorization', `Basic ${this.auth}`);
        http.onreadystatechange = function() {
            console.log(`Open Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
            if(http.readyState == 4){
                if(http.status == 200) {
                    console.log("Connection successful");
                    var json = JSON.parse(http.responseText);
                    this.token = json.response.token;
                    this.auth = "";
                    this.performFind(arguments[0], arguments[1]);
                } else {
                    console.log ("[Error: " + http.status + "] Something went wrong while trying to connect to Filemaker");
                }
            }
        }
        http.send(body);
    }

    closeConnection(){
        console.log("Closing Connection to FileMaker");
        let url = `https://${settings.host}/fmi/data/vLatest/databases/${settings.file}/sessions/${settings.token}`;
        let http = new XMLHttpRequest();
        http.open('DELETE', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            console.log(`Close Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
            if(http.readyState == 4){
                if(http.status == 200) { 
                    this.token = "";
                } else {
                    console.log("Error " + http.status + "Something went wrong while trying to disconnect from Filemaker.");
                }
            }
        }
        http.send();
        }

}