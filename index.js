const express = require("express");

const request = require("request");

const app = express();

const PORT = 3000;

const api_key = "1e5b0a12eb24531d6504a7574bdc1045"

app.use(express.static("public"));

app.use(express.urlencoded({extended:false}));

// set the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {weather : null, weatherIcon : null, error : null });
})

app.post("/", (req, res) => {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${api_key}`;

    request(url, function(err, response, body) {
        if (err) {
            res.render('index', { weather: null, weatherIcon : null, error: "Error in fetching weather of city"});
        }
        else {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', { weather: null, weatherIcon : null, error: "Error, please try again"});
            }
            else {
                let weatherText = fToC(weather.main.temp);

                let weatherIconURL = weather.weather[0].icon;
                console.log(weather.weather[0].icon);

                res.render("index", { weather : weatherText, city : city, weatherIcon : weatherIconURL, error : null});
            }
        }
    })
})

function fToC(fahrenheit) {
    var fTemp = fahrenheit;
    var fToCel = Math.round((fTemp - 32) * 5 / 9);
    var message = fToCel + "\xB0C";
    return message;
}

app.listen(3000,() => {
    console.log("App is listening on port 3000.");
})

