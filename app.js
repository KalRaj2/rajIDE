function openTab(id) {
  document.getElementById(id).style.display = "block";
}

// GENERATE DESIGN
async function generateDesign() {

  let res = await fetch("http://localhost:3100/generate-design", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({srs: "test"})
  });

  let data = await res.json();

  document.getElementById("designOutput").innerText = data.output;
}

// UML IMAGE
async function generateDiagram() {

  let text = document.getElementById("designOutput").innerText;

  let res = await fetch("http://localhost:3100/generate-uml-image", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({uml: text})
  });

  let data = await res.json();

  if (!data.image) {
    alert("No UML found");
    return;
  }

  document.getElementById("designOutput").innerHTML +=
    `<br><img src="${data.image}" width="400"/>`;
}

// OPEN DRAW.IO
let frame;
let ready = false;

window.addEventListener("load", () => {
  frame = document.getElementById("diagramFrame").contentWindow;
});

// Listen messages from draw.io
window.addEventListener("message", async (event) => {

  if (!event.data) return;

  let msg;

  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }

  // Editor ready
  if (msg.event === "init") {
    ready = true;
    console.log("Editor Ready ✅");

    // Load blank diagram
    frame.postMessage(JSON.stringify({
      action: "load",
      xml: ""
    }), "*");
  }

  // Save response
  if (msg.event === "export") {

  console.log("Received diagram XML");

  fetch("http://localhost:3100/save-diagram", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ data: msg.data })
  })
  .then(() => {
    alert("Diagram saved successfully ✅");
  })
  .catch(err => {
    console.error(err);
    alert("Save failed ❌");
  });

}
// SAVE
function saveDiagram() {

  if (!ready) {
    alert("Editor still loading...");
    return;
  }

  // Ask draw.io to export XML
  frame.postMessage(JSON.stringify({
    action: "export",
    format: "xml"
  }), "*");
}
// LOAD
async function loadDiagram() {

  if (!ready) {
    alert("Editor still loading...");
    return;
  }

  try {

    let res = await fetch("http://localhost:3100/load-diagram");
    let data = await res.json();

    if (!data.data || data.data.trim() === "") {
      alert("No saved diagram found ❌");
      return;
    }

    console.log("Loading diagram...");

    // 🔥 IMPORTANT DELAY (fix timing issue)
    setTimeout(() => {
      frame.postMessage(JSON.stringify({
        action: "load",
        xml: data.data
      }), "*");
    }, 500);

  } catch (err) {
    console.error(err);
    alert("Load failed");
  }
}



