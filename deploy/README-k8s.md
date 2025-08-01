# Kubernetes Deployment for Consciousness Stack

## Prerequisites

- Kubernetes cluster (minikube, GKE, EKS, etc.)
- kubectl
- Docker image for API built and pushed (update `repo/api:latest` in api-deployment.yaml)
- Base64-encoded JWT keys (see secret-jwt.yaml)

## Install

```bash
kubectl apply -k deploy/k8s
```

This will create the namespace, secrets, ConfigMap, Postgres, and API Deployment+Service.

## Load Testing

You can run a basic HTTP load test (requires [k6](https://k6.io/)):

```bash
npm run load:test
# or
k6 run scripts/k6-load.js
```

Set BASE_URL and JWT env vars to target cluster endpoint and use a valid token.

---

## Chaos Testing

If using [Chaos Mesh](https://chaos-mesh.org/), the included `chaos/kill-postgres.yaml`
will kill a random Postgres pod every hour for 30s. Enable with:

```bash
kubectl apply -f deploy/k8s/chaos/kill-postgres.yaml
```

This tests API resilience to DB outages. Remove or comment out in kustomization.yaml to disable.

---

## Notes

- The API expects JWT private/public keys provided as Kubernetes secrets via [ExternalSecrets](https://external-secrets.io/).  
  You must deploy the [external-secrets operator](https://external-secrets.io/docs/introduction/getting-started/) in your cluster and create the actual JWT and Postgres secrets in the referenced backend namespace.

  ```
  # Example: create raw secrets in 'secret-backend' namespace
  kubectl -n secret-backend create secret generic jwt-keys \
    --from-file=jwtRS256.key --from-file=jwtRS256.key.pub
  kubectl -n secret-backend create secret generic postgres-secret \
    --from-literal=POSTGRES_PASSWORD=postgres
  ```

  You can generate the keys locally with:
  ```
  openssl genrsa -out jwtRS256.key 2048
  openssl rsa -in jwtRS256.key -pubout -out jwtRS256.key.pub
  ```

  See deploy/k8s/secret-store.yaml and externalsecret-jwt.yaml for the reference setup.

- The API container image should be built and pushed to your registry:

  ```
  docker build -t repo/api:latest -f Dockerfile.api .
  docker push repo/api:latest
  ```

- Prometheus will auto-scrape `/metrics` if deployed.

- To customize the database storage or resources, edit the YAML and re-apply.