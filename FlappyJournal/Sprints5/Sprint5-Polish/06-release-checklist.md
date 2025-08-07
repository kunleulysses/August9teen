# 06 – Release Checklist

**Objective:**  
Finalize and launch the quantum stack to production.

**Why it matters:**  
Ensures nothing is missed, launch is safe and auditable.

---

## Preconditions

- All Sprints complete
- Stakeholder sign-off

---

## Procedure

### 1. Checklist

- [ ] All tests passing
- [ ] SLOs met (latency, reliability, security)
- [ ] Docs and runbooks up to date
- [ ] Metrics visible in Grafana
- [ ] Incident response plan in place

### 2. Tag & release

```sh
git tag v1.0.0-quantum
git push --tags
```

---

## Verification

- Live system matches "Definition of Done"
- Stakeholder demo: all green on dashboard

---

## Rollback / Troubleshooting

- Use `git revert`/`rollback` scripts if showstopper found
- Roll back Docker image in cluster

---

## Time Estimate

00:25

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-5.6