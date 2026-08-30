const express = require("express");
const path = require("path");

const app = express();
const PORT = 4000;
app.use(express.static(path.join(__dirname, "files")));
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});