var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// endpoints
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date", (req, res) => {
  let timestamp = req.params.date;

  if (timestamp.match(/\d{5,}/)) {
    timestamp = +timestamp;
  }

  let date = new Date(timestamp);

  if (isNaN(date)) {
    res.status(400).json({ error: "Invalid Date" });
  } else {
    const utcDate = new Date(date).toISOString();
    res.json({
      unix: date.valueOf(),
      utc: parseDateToFormat(utcDate),
    });
  }
});

app.get("/api", (req, res) => {
  let date = new Date();
  res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

// Helper function
function parseDateToFormat(dateString) {
  // Parse the input date string
  const date = new Date(dateString);

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  function getDayOfWeek(day) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[day];
  }

  function getMonth(month) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  }

  // Get the individual components of the date
  const dayOfWeek = getDayOfWeek(date.getUTCDay());
  const dayOfMonth = padZero(date.getUTCDate());
  const month = getMonth(date.getUTCMonth());
  const year = date.getUTCFullYear();
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  // Format the date string
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;

  return formattedDate;
}

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
