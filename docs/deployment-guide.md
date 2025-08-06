# Deployment Guide

## Docker Compose

1. Copy and edit the example environment file.
   ```bash
   cp .env.docker.example .env.docker
   ```
2. Build and start the stack.
   ```bash
   docker compose up --build
   ```
3. Include monitoring services when needed.
   ```bash
   docker compose --profile monitoring up --build
   ```
4. Access services:
   - API: `http://localhost:<api-port>`
   - Metrics: `http://localhost:<metrics-port>/metrics`

## Kubernetes

1. Build and push the container image.
   ```bash
   docker build -t <registry>/featherweight .
   docker push <registry>/featherweight
   ```
2. Apply manifests from the `k8s/` directory.
   ```bash
   kubectl apply -f k8s/
   ```
3. Verify that pods are running.
   ```bash
   kubectl get pods
   ```
4. Expose the service or configure ingress as needed.
   ```bash
   kubectl port-forward svc/featherweight 8080:80
   ```
5. Scale the deployment.
   ```bash
   kubectl scale deployment featherweight --replicas=3
   ```
