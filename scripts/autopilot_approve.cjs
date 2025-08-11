"use strict";
const fs = require("fs");
const path = require("path");
const approvalsRoot = path.resolve(
  "/opt/featherweight",
  "artifacts",
  "autopilot-approvals"
);
const arg = process.argv[2];
if (!arg) {
  console.error("Usage: autopilot_approve.cjs <id>|latest");
  process.exit(1);
}
if (!fs.existsSync(approvalsRoot)) {
  console.error("No approvals directory");
  process.exit(2);
}
const pendingFiles = fs
  .readdirSync(approvalsRoot)
  .filter((f) => /^pending-.*\.json$/.test(f));
if (!pendingFiles.length) {
  console.error("No pending approvals");
  process.exit(3);
}
let id = arg;
if (arg === "latest") {
  pendingFiles.sort(
    (a, b) =>
      fs.statSync(path.join(approvalsRoot, a)).mtimeMs -
      fs.statSync(path.join(approvalsRoot, b)).mtimeMs
  );
  const latest = pendingFiles[pendingFiles.length - 1];
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(approvalsRoot, latest), "utf8")
    );
    id = data.id || latest.replace(/^pending-/, "").replace(/\.json$/, "");
  } catch (_) {
    id = latest.replace(/^pending-/, "").replace(/\.json$/, "");
  }
}
// Create approval file
const approveFile = path.join(approvalsRoot, `approve-${id}.json`);
fs.writeFileSync(
  approveFile,
  JSON.stringify({ id, approvedAt: Date.now() }, null, 2),
  "utf8"
);
console.log("APPROVED", id);
