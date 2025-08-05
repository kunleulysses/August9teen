# 03 – SBOM & Release Workflow

## Goal
Generate and publish a Software Bill of Materials (SBOM), sign production images, and automate the draft-release process for every GA cut.

## Prerequisites
- `syft`, `cosign` installed locally/CI
- CI write access (`.github/workflows/`)
- Container images built and pushed to registry

## Step-by-Step Instructions

1. **Generate SBOM**
   - File: `artifacts/holograph-sbom.json`
   - Command:
     ```sh
     syft packages . -o json > artifacts/holograph-sbom.json
     ```

2. **Sign Container Images**
   - Command:
     ```sh
     cosign sign --key env://COSIGN_PRIVATE_KEY ghcr.io/org/holograph-api:latest
     ```

3. **Draft Release Workflow**
   - File: `.github/workflows/draft-release.yml`
   - Example:
     ```yaml
     name: Draft Release
     on:
       push:
         tags:
           - 'v*.*.*'
     jobs:
       release:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - name: Attach SBOM
             uses: actions/upload-artifact@v4
             with:
               name: sbom
               path: artifacts/holograph-sbom.json
           - name: Create Release
             uses: softprops/action-gh-release@v2
             with:
               files: artifacts/holograph-sbom.json
     ```

4. **Publish and Announce**
   - Tag release with `v0.1.0-holo`, run workflow, share release notes.

## Verification & Acceptance Criteria
- [ ] SBOM attached to every GA release
- [ ] Images signed and verified
- [ ] Draft release contains all required artifacts

## Time Estimate & Owner
- 0.5 day (Dev Rel, Security)

## Common Pitfalls & Mitigations
- **Pitfall:** SBOM not updated for patch releases  
  **Mitigation:** Add SBOM step to release PR template

- **Pitfall:** Cosign key management errors  
  **Mitigation:** Use encrypted secrets and rotate keys regularly

- **Pitfall:** Draft release missing artifacts  
  **Mitigation:** Test workflow on release-candidate branch