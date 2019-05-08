
function findRecords(layout, query, callback){
    settings.layout = layout;
    settings.query = query;
    settings.callback = callback;
    openConnection();
}

function openConnection(){
    console.log("Fetch started.");
    let url = `https://${settings.host}/fmi/data/vLatest/databases/${settings.file}/sessions`;
    var http = new XMLHttpRequest();
    var body = '{}';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Authorization', `Basic ${settings.auth}`);
    http.onreadystatechange = function() {
        //console.log(`Open Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
        if(http.readyState == 4 && http.status == 200) {
            var json = JSON.parse(http.responseText);
            settings.token = json.response.token;
            performFind(settings.layout, settings.find);
        }
    }
    http.send(body);
}
function performFind(){
    let url = `https://${settings.host}/fmi/data/v1/databases/${settings.file}/layouts/${settings.layout}/_find`;
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Authorization', `Bearer ${settings.token}`);
    http.onreadystatechange = function() {
        //console.log(`Get Records - Ready State: [${http.readyState}] Status: [${http.status}]`);
        if(http.readyState == 4 && http.status == 200) {
            var json = JSON.parse(http.responseText);
            json.response.data;
            settings.callback(json.response.data);
            console.log("Fetch Complete");
            closeConnection();
        }
    }
    http.send(JSON.stringify(settings.query));
}

function closeConnection(){
    if (!settings.token) {console.log('Err - No token found.' ); return;}
    let url = `https://${settings.host}/fmi/data/vLatest/databases/${settings.file}/sessions/${settings.token}`;
    var http = new XMLHttpRequest();
    http.open('DELETE', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
        //console.log(`Close Connection - Ready State: [${http.readyState}] Status: [${http.status}]`);
        if(http.readyState == 4 && http.status == 200) {
            var json = JSON.parse(http.responseText);
            settings.token = "";
        }
    }
    http.send();
}