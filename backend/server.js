const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ROOT
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// AI DESIGN
app.post("/generate-design", (req, res) => {

  const output = `
HLD:
- UI Layer
- API Layer

LLD:
- Login Module

UML:

@startuml
actor User
User -> System: Login
System -> DB: Validate
@enduml
`;

  res.json({ output });
});

// UML IMAGE
app.post("/generate-uml-image", (req, res) => {

  let text = req.body.uml;

  let start = text.indexOf("@startuml");
  let end = text.indexOf("@enduml");

  if (start === -1 || end === -1) {
    return res.json({ image: "" });
  }

  let uml = text.substring(start, end + 7);

  const encoded = Buffer.from(uml).toString("base64");

  const url = `https://www.plantuml.com/plantuml/png/~b${encoded}`;

  res.json({ image: url });
});

// SAVE DIAGRAM
app.post("/save-diagram", (req, res) => {

  const fs = require("fs");
  const path = require("path");

  const filePath = path.join(__dirname, "../data/design/diagram.xml");

  console.log("Saving diagram...");

  fs.writeFileSync(filePath, req.body.data || "", "utf-8");

  console.log("Saved successfully!");

  res.send("Saved");
});

// LOAD DIAGRAM
app.get("/load-diagram", (req, res) => {

  const filePath = require("path").join(__dirname, "../data/design/diagram.xml");

  try {

    if (!require("fs").existsSync(filePath)) {
      return res.json({ data: "" });
    }

    const data = require("fs").readFileSync(filePath, "utf-8");

    console.log("Loaded diagram:", data.substring(0, 100)); // debug

    res.json({ data });

  } catch (err) {
    console.error(err);
    res.json({ data: "" });
  }
});

app.listen(3100, () => console.log("Server running on 3100"));