# Setting up your FileMaker server for Cross Origin Support (FMS 17 and lower)
> Reference - https://msdev.co.uk/fms-cross-origin/
## *Windows Setup*
1. Using the Web Platform Installer install the CORS module for IIS (if not already installed). You might have to restart the server (not just IIS) to complete this installation. Found [Here](https://www.iis.net/downloads/microsoft/iis-cors-module)
2. Open C:\Program Files\FileMaker\FileMaker Server\HTTPServer\conf\web.config in your favourite text editor (you may want to make a backup first, just in case 😉
3. At the following code to the bottom of the file, just before </system.webServer>
````
<cors enabled="true" failUnlistedOrigins="true">
    <add origin="*">
    <allowHeaders allowAllRequestedHeaders="true" />
    <allowMethods>
        <add method="GET" />
        <add method="PATCH" />
        <add method="POST" />
        <add method="DELETE" />
    </allowMethods>
    </add>
</cors>
````
4. Run "fmsadmin restart httpserver" in the Server Admin CLI

- note: Adding the Origin "*" will allow anyone to make scripted calls against your server. I would recommend that if you are trying to call data from your system that you add at least the domain where your website is hosted, and then another "add origin" tag for each specific origin that you want to add, like your Developer machine domain, etc. Use the fully qualified domain name such as *https://www.yourserver.com*
## *Mac Setup*
1. Open /Library/FileMaker Server/HTTPServer/conf/httpd.conf.2.4 in your favourite text editor
2. Locate the entry <Location “/fmi”> likely around line 459
3. At the bottom of that declaration (just before </Location>) add the following lines (setting the Allow-Origin header as appropriate for your environment).
````
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin, Authorization"
Header always set Access-Control-Allow-Methods "PATCH, GET, POST, DELETE, OPTIONS"
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
````
4. Save the file, and restart FileMaker apache with 
``sudo /Library/FileMaker\ Server/HTTPServer/bin/httpdctl graceful``

    *By way of explanation – the first three lines are returning headers which tell the browser that it’s allowed to connect if the code is being run from the ‘Allow-Origin’ location. It then lists the headers which are allowed to be sent. The third header defines the methods which are supported.*

    *The last three lines are necessary for the CORS preflight check. Essentially what happens when a browser goes to make a CORS request is that it issues an OPTIONS HTTP request, and then inspects the returned headers. The /fmi location is acting as a proxy to a component of FileMaker server which doesn’t know what to do with the OPTIONS method, so we use a simple rewrite rule to return a 200 ‘success’ status code. The always in the three headers being set means that they are also returned with the status code, so the browser knows what it’s allowed to do.*

# FMJS Ideation
(Rebranded 5/15/2019 from FMConnect)

This is meant to be a simple library for scripting calls to the FileMaker Data API (Currently v17, soon v18) that can be done via a Javascript interface.

As of now, I only have this fmconnect.js file that I created for the purpose of performing a find. 

I ultimately want to create a constructor for the openConnection() closeConnection() functions and set up callback scripts so that they can be used dynamically. I'm going to experiment with using Javascript classes, etc. But ultimately this needs to be supported by ie8+. Hence the XMLHttpRequests instead of ``fetch().then()`` and ``async / await``. My javascript skills are not the greatest so I would really appreciate any input, feedback, or even code that could improve this project.

There are a lot of node.js files, but I don't understand why you have to create another node app, to talk to a node app, that will then in turn feed data to your web page. 

### Original Usage - Working 
````
var settings = {
    host : "fcns.dallasisd.org",
    file : "summer_food_sites_lookup",
    auth : btoa(`${"username"}:${"password"}`)
}
var layout = "Sites";

var find = {
                "query" : [{
                    "is_active" : 1
                }],
                "limit": "1000"
            }

findRecords(layout, find);
````

### Ideal Usage:
````
var fm = new FMConnect({
    host : "yourhost.com",
    file : "filename",
    user : "username",
    pass : "password"
});

var layout = "Sites";

var find = {
    "query" : [{
        "is_active" : 1
    }],
    "limit": "*"
}

fm.findRecords(layout, find);
````
Note: The query follows FileMakers specifications for making a query, I in no way want to rewrite that.

Note: I don't want to leave a lingering connection. My goal here is to just open the connection, get the data, and get out. Maybe we can put something in so that if you want to open a lasting connection, you can do that. Perhaps a ``settings { maintainConnection : true }`` type of thing.

**Thank You**

## Methods (so far)

``findRecords(layout, query);``

