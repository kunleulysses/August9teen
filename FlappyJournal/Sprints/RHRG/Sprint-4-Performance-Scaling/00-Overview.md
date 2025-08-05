# Sprint 4: Performance & Scaling – Overview

## Goal
Achieve reliable, scalable performance through headless-gl benchmarking, GPU memory management, autoscaling in Kubernetes, and chaos validation.

## Prerequisites
- Sprints 0–3 complete (metrics, security, core runtime)
- GPU-enabled dev/staging environment
- Access to `bench/`, `server/holograph/worker/`, `k8s/`, `.github/workflows/`

## Step-by-Step Instructions
1. Upgrade benchmark to use headless-gl and three.js (see 01-Benchmark-Upgrade-Headless-GL.md)
2. Track and recycle GPU memory usage in worker (see 02-GPU-Memory-Recycling.md)
3. Implement K8s Horizontal Pod Autoscaler using metrics (see 03-K8s-HPA.md)
4. Run and automate chaos tests for resilience (see 04-Chaos-Tests.md)
5. Document performance SLOs and regression thresholds

## Verification & Acceptance Criteria
- [ ] Benchmarks run on every PR and nightly, pass regression gates
- [ ] GPU memory never exceeds 90% of node capacity
- [ ] HPA autoscaler scales pods in/out based on real load
- [ ] Chaos tests prove system recovers from faults

## Time Estimate & Owner
- 1.5 weeks (Perf Squad, SRE)

## Common Pitfalls & Mitigations
- **Pitfall:** Benchmarks run on non-GPU hardware  
  **Mitigation:** Use GHA runners with GPU labels, verify with `nvidia-smi`

- **Pitfall:** GPU memory leaks  
  **Mitigation:** Always free textures/buffers, monitor with Prometheus

- **Pitfall:** HPA scaling too slowly  
  **Mitigation:** Tune metrics scrape interval and HPA reaction