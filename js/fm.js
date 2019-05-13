function FMJS(settings) {

    this.host = settings.host || 'localhost';
    this.file = settings.file;
    let token;

    this.performFind = function(layout, query){
        if (!token){ 
            console.log("Open Connection");
            settings.layout = layout;
            settings.query = query;
            openConnection(performFind(layout, query));
            return;
        } else {
            console.log("Performing Find");
            let url = `https://${settings.host}/fmi/data/v1/databases/${settings.file}/layouts/${layout}/_find`;
            let http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', `Bearer ${token}`);
            http.onreadystatechange = function() {
                if(http.readyState == 4){
                    if(http.status == 200) {
                        var json = JSON.parse(http.responseText);
                        closeConnection();
                        return json.response.data;
                    } else {
                        return `Http status: [${http.status}] ${http.statusText}`;
                    }
                }
            }
            http.send(JSON.stringify(query));
        }
    }

    openConnection = function(){
        let url = `https://${settings.host}/fmi/data/vLatest/databases/${settings.file}/sessions`;
        var http = new XMLHttpRequest();
        var body = '{}';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('Authorization', `Basic ${btoa(settings.user+':'+settings.pass)}`);
        http.onreadystatechange = function() {
            if(http.readyState == 4){
                if ( http.status == 200 ) {
                    var json = JSON.parse(http.responseText);
                    token = json.response.token;
                    this.performFind();
                } else {
                    console.log(`[Error: ${http.status}] Unable to connect to the file ${settings.file} on the host https://${settings.host}`);
                }
            }
        }   
        http.send(body);
    }

    closeConnection = function(){
        if (!this.token) { console.log('Err - No token found.' ); return;}
        let url = `https://${settings.host}/fmi/data/vLatest/databases/${settings.file}/sessions/${token}`;
        var http = new XMLHttpRequest();
        http.open('DELETE', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            if(http.readyState == 4){
                if(http.status == 200) {
                    var json = JSON.parse(http.responseText);
                    token = "";
                }else{
                    console.log(`[Error: ${http.status}] Network Connection failed when attempting to close the file`);
                }
            }
        }
        http.send();
    }

}