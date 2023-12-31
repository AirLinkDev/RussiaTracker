
// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://www.alphavantage.co/query?function=";
const API_getRUB ="FX_DAILY&from_symbol=USD&to_symbol=RUB&apikey=";
const API_getCRUDE = "BRENT&interval=daily&apikey=";
const API_key = "GX5E5DCMC1KZPO78";
// HINTS:


app.use(bodyParser.urlencoded({ extended: true }));


// 3. Use the public folder for static files.
app.use(express.static("public"));//This way any static files used in the ejs can use the relative path after "public/"

// 4. When the user goes to the home page it should render the index.ejs file.

app.get("/", async(req, res) => {
    try {
        let url = API_URL+API_getRUB+API_key;
        console.log("my url "+url);
        const response = await axios.get(url
          );
        const temp = response.data["Time Series FX (Daily)"];
        //console.log("The response was "+JSON.stringify(temp));
        let today;
        let yesterday;
        let tday;
        let yeday;
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        //adjusts the timestamp backward by 12 hour increments(x) until data is acquired
        for(let x=0;x<72;x++){
          let newDate = new Date();
          let dateObj = new Date(newDate.getTime()-x*12*60*60*1000);
          let yms = dateObj.getTime()-(24*60*60*1000);
          let ydateObj = new Date(yms);
          let month = dateObj.getUTCMonth() + 1; //months from 1-12
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          let ymonth = ydateObj.getUTCMonth() + 1; //months from 1-12
          let yday = ydateObj.getUTCDate();
          let yyear = ydateObj.getUTCFullYear();
          today = year+"-"+month+"-"+day;
          yesterday = yyear+"-"+ymonth+"-"+yday;
          
          tday = weekday[dateObj.getDay()];
          yeday = weekday[ydateObj.getDay()];
          console.log("Now testing today: "+today);
          console.log("yesterday "+yesterday);
          if(temp[today]===undefined){
            console.log(today+" is undefined");          
          }else{
            
            break;
          }
        }
          console.log("Acquired fresh data from: "+today+" with value: "+JSON.stringify(temp[today]));
          const rublToday = temp[today];
          const rublYesterday = temp[yesterday];

        
        let diff = "The Ruble shrank in value by: "+((rublToday["2. high"]-rublYesterday["2. high"])/rublToday["2. high"]).toFixed(4)*100+"% against USD"
        let state = "sadPutin";
        if((rublToday["2. high"]<rublYesterday["2. high"] )&&(rublToday["2. high"]<100)){
          state = "happyPutin";
          diff = "The Ruble grew in value by: "+((rublYesterday["2. high"]-rublToday["2. high"])/rublYesterday["2. high"]).toFixed(4)*100+"% against USD"
        }
        console.log("Rubl for " +today+": "+JSON.stringify(rublToday));
        console.log("Rubl for " +yesterday+": "+JSON.stringify(rublYesterday));
        const retObj = { 
          putinState : state,
          today: tday+": "+rublToday["2. high"], 
          yesterday : yeday+": "+rublYesterday["2. high"],
          result: diff
        };
        console.log("Sending to ejs page: " +JSON.stringify(retObj));
        res.render("index.ejs", retObj);
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
  });

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.






// 2. Create an express app and set the port number.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
