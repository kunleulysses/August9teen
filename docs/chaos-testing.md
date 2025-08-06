# Chaos Testing with Litmus

This project uses [LitmusChaos](https://litmuschaos.io/) to validate resiliency. The manifests for each experiment live in `k8s/chaos/` and can be executed manually or on a schedule.

## Experiments

- **Pod Kill**: Deletes one of the application pods to ensure that the deployment recovers.
- **DB Loss**: Simulates database unavailability by deleting a database pod.
- **Broker Partition**: Introduces a network partition for the message broker pods.

## Running Experiments

Ensure you have `kubectl` access to the cluster and Litmus installed. Then run:

```bash
./scripts/run-chaos-experiments.sh
```

The script applies each experiment manifest and captures the resulting `ChaosResult` into `docs/chaos-results/` with a timestamped filename.

## Scheduling

To execute the suite nightly at 03:00, install a cron job:

```bash
./scripts/schedule-chaos.sh
```

This script adds a crontab entry that runs `run-chaos-experiments.sh` and logs output to the results directory.

## Viewing Results

Each run produces YAML files in `docs/chaos-results/`. Review these files to verify the outcome of the experiments and track failures over time.
