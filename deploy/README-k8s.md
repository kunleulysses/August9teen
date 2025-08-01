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

## Notes

- The API expects JWT private/public keys provided in the secret. You can generate with:

  ```
  openssl genrsa -out jwtRS256.key 2048
  openssl rsa -in jwtRS256.key -pubout -out jwtRS256.key.pub
  ```

  Then base64 encode each for the k8s Secret.

- The API container image should be built and pushed to your registry:

  ```
  docker build -t repo/api:latest -f Dockerfile.api .
  docker push repo/api:latest
  ```

- Prometheus will auto-scrape `/metrics` if deployed.

- To customize the database storage or resources, edit the YAML and re-apply.