const express = require("express");
const axios = require("axios").default;
const hbs = require("hbs");
const handlebars = require("handlebars");
const { response } = require("express");
const app = express();
const port = process.env.port || 4500;

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views", function (err) {});
app.use(express.static("static"));

hbs.registerHelper("list", function (items, options) {
  let rowdata = Object.entries(items).reduce((row, [key, value]) => {
    return (row += "<li>\n" + options.fn({ key, value }) + "</li>\n");
  }, "<ul>\n");
  return rowdata + "</ul>";
});

app.get("/", (req, res) => {
  res.render("template", {
    title: "Home",
  });
});
app.get("/covid19", (req, res) => {
  axios
    .get("https://api.covid19api.com/countries")
    .then(({ data: countries }) => {
      axios
        .get("https://api.covid19api.com/summary")
        .then(({ data: { Countries } }) => {
          const getreq = req.query.country;
          const check = Countries.find((country) => country.Slug == getreq);
          res.render("covid", {
            title: check
              ? `Infomartion of Covid-19 in ${check.Country}`
              : `Infomartion of Covid-19`,
            countries: countries,
            CountryCheck: check,
          });
        });
    })

    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Port: ${port}`);
});
