const fs = require("fs");
const http = require("http");
const bodyParser = require('body-parser');

var requests = require("requests");

var adr = 'http://api.openweathermap.org/data/2.5/weather?q=dehradun&appid=d6bc506ba3c8d0180aad4ddebf32a139';  


const  port = process.env.PORT || 8000;


const homeFile = fs.readFileSync('structure.html','utf-8');

//console.log(homeFile);
const replaceVal = (file_name , u_data)=>{
    let temperature = file_name.replace("{%temp%}",u_data.main.temp - 273.15 );
    temperature = temperature.replace("{%min_temp%}",u_data.main.temp_min - 273.15);
    temperature = temperature.replace("{%max_temp%}",u_data.main.temp_max - 273.15);
    temperature = temperature.replace("{%location%}",u_data.name);
    temperature = temperature.replace("{%country%}",u_data.sys.country);
    temperature = temperature.replace("{%status%}",u_data.weather[0].main);
    temperature = temperature.replace("{%desc%}",u_data.weather[0].description);

    return temperature;

};

const server = http.createServer((req,res)=>{
    
    if(req.url == '/'){
        requests(adr)
        .on("data",(chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData   = arrData.map((val)=>replaceVal(homeFile,val)).join("");
            //console.log(arrData);
            //console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err){
                return console.log("ERROR!");
            }
            res.end();
        });
        //res.end();
    }
});




// fetching api another way :

// http.get("http://api.openweathermap.org/data/2.5/weather?q=dehradun&appid=d6bc506ba3c8d0180aad4ddebf32a139",res=>{
//     let data = "";
//     res.on("data",(chunk)=>{
//         data+=chunk;
//     });

//     res.on("end",()=>{
//         let url = JSON.parse(data);
//         console.log(url);
//     });

// }).on("error",(err)=>{
//     console.log("Error : "+err.message);
// });

// another thing :

    // const server = http.createServer((req,res)=>{
    // console.log("DFSD");
    // fs.readFile("./structure.html",(err , data)=>{
    //     if(err){
    //         console.log("ERROR!");
    //     }else{
    //         res.writeHead(200,{'content-type':'text/html'});
    //         res.write(data);
    //     }
    //     res.end
    // });

server.listen(port,()=>{
    console.log("server listening to port "+port);
});