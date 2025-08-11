"use strict";
const fs = require("fs");
const path = require("path");
const approvalsRoot = path.resolve("/opt/featherweight", "artifacts", "autopilot-approvals");

if (!fs.existsSync(approvalsRoot)) {
  console.log("No pending approvals");
  process.exit(0);
}

const files = fs
  .readdirSync(approvalsRoot)
  .filter((f) => /^pending-.*\.json$/.test(f));

if (!files.length) {
  console.log("No pending approvals");
  process.exit(0);
}

files.sort(
  (a, b) =>
    fs.statSync(path.join(approvalsRoot, a)).mtimeMs -
    fs.statSync(path.join(approvalsRoot, b)).mtimeMs
);

for (const f of files) {
  const full = path.join(approvalsRoot, f);
  try {
    const data = JSON.parse(fs.readFileSync(full, "utf8"));
    const when = data.createdAt
      ? new Date(data.createdAt).toISOString()
      : "unknown_time";
    console.log(`${data.id} ${when}`);
  } catch (_) {
    console.log(f);
  }
}
