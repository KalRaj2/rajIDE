const { execSync } = require("child_process");

exports.commit = (msg) => {
  try {
    execSync("git add .");
    execSync(`git commit -m "${msg}"`);
    return execSync("git log --oneline -5").toString();
  } catch(e) {
    return e.toString();
  }
};

exports.push = () => {
  try {
    execSync("git push");
    return "Pushed to remote";
  } catch(e) {
    return e.toString();
  }
};