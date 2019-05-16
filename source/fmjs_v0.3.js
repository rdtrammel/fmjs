//Functional, but not asynchronous, and you need to create a separate open method for each function you want to create. It's just..the worst.
class FMJS{

    constructor(settings){
        this.host = settings.host;
        this.file = settings.file;
        this.auth = settings.auth || btoa(`${settings.user}:${settings.pass}`);
        this.token = settings.token || "";
    }

    performFind(layout, query){
        if (!this.token){
            this.openFind(layout, query);
        } else {
            console.log("Finding Records.");
            let url = `https://${this.host}/fmi/data/v1/databases/${this.file}/layouts/${layout}/_find`;
            let x = new FMJS({host:this.host,file:this.file,token:this.token});
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', `Bearer ${this.token}`);
            http.onreadystatechange = function() {
                //console.log(`Get Records - Ready State: [${http.readyState}] Status: [${http.status}]`);
                if(http.readyState == 4) {
                    if(http.status == 200) {
                        var response = JSON.parse(http.responseText);
                        console.log("Fetch Complete");
                        console.table(response.response.data);
                        x.closeConnection();
                    }else{
                        console.log ("[Error: " + http.status + "] Something went wrong while performing the Find.");
                        x.closeConnection();
                    }
                }
            }
            http.send(JSON.stringify(query));
        }
    }

    closeConnection(){
        console.log("Closing Connection to FileMaker");
        let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions/${this.token}`;
        let http = new XMLHttpRequest();
        http.open('DELETE', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            //console.log(`Close Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
            if(http.readyState == 4){
                if(http.status == 200) { 
                    console.log("Disconnected from FileMaker");
                    this.token = "";
                } else {
                    console.log("[Error :" + http.status + "] Something went wrong while trying to disconnect from Filemaker.");
                }
            }
        }
        http.send();
    }

    openFind(){
        console.log("Connecting to FileMaker");
        let url = `https://${this.host}/fmi/data/vLatest/databases/${this.file}/sessions`;
        let http = new XMLHttpRequest();
        let body = '{}';
        let args = arguments;
        let hostName = this.host;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('Authorization', `Basic ${this.auth}`);
        http.onreadystatechange = function() {
            //console.log(`Open Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
            if(http.readyState == 4){
                if(http.status == 200) {
                    console.log("Connection successful");
                    var json = JSON.parse(http.responseText);
                    this.token = json.response.token;
                    this.auth = "";
                    let x = new FMJS({host:hostName,file:this.file,token:this.token});
                    x.performFind(args[0], args[1]);
                } else {
                    console.log ("[Error: " + http.status + "] Something went wrong while trying to connect to Filemaker");
                }
            }
        }
        http.send(body);
    }

}