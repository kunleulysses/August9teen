import express from "express";
import promClient from "prom-client";

const app = express();
const port = 9091;

// TODO: Register real metrics
promClient.register.setDefaultLabels({
  app: "holograph"
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  // TODO: Add logger
  console.log(`[metrics] Prometheus metrics server listening on ${port}`);
});