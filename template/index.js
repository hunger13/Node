let http = require("http");
let fs = require("fs");

http
  .createServer((req, res) => {
    if (req.url == "/") {
      configFile(res);
    }
  })
  .listen(3000, () => console.log("监听在3000端口"));

function configFile(res) {
  fs.readFile("./tem.json", (err, data) => {
    if (err) return handleError(err, res);
    getTitles(res, JSON.parse(data.toString()));
  });
}

function getTitles(res, titles) {
  fs.readFile("./index.html", (err, data) => {
    if (err) return handleError(err, data);
    getHTML(res, data, titles);
  });
}

function getHTML(res, data, titles) {
  let tmp = data.toString();
  let html = tmp.replace("$", titles.join("</li><li>"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

function handleError(err, res) {
  console.error(err);
  res.end("Server Error");
}
