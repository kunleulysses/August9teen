# 01 – Threat Model

## Goal
Develop a comprehensive threat model using STRIDE, with data flow diagrams (DFDs) and actionable mitigations.

## Prerequisites
- All system diagrams and API endpoints up to date
- Access to `docs/holograph/` for diagram and model storage

## Step-by-Step Instructions

1. **Document System Context**
   - Identify all trust boundaries, data stores, and APIs.
   - File: `docs/holograph/DFD.png` (draw with draw.io, Lucidchart, or similar).

2. **STRIDE Analysis**
   - For each DFD element, classify threats by:
     - S: Spoofing (e.g. JWT forgery)
     - T: Tampering (scene graph mutation)
     - R: Repudiation (lack of trace in audit logs)
     - I: Information Disclosure (leaked metrics, scene data)
     - D: Denial of Service (WS flooding, recursion abuse)
     - E: Elevation of Privilege (broken authz)

3. **Tabulate Threats & Mitigations**
   - File: `docs/holograph/ThreatModel.md`
   - Table example:
     | Threat                 | STRIDE | Mitigation                            |
     |------------------------|--------|---------------------------------------|
     | JWT replay             | S      | Use exp/nbf/aud, 15 min TTL           |
     | SceneNode injection    | T      | Schema validation, input sanitization |
     | Unbounded recursion    | D      | Depth cap, metrics, alerting          |
     | ...                    | ...    | ...                                   |

4. **Review and Iterate**
   - PR review with Security Guild; assign owners for each mitigation.

## Verification & Acceptance Criteria
- [ ] DFD and ThreatModel.md committed in `docs/holograph/`
- [ ] All STRIDE categories analyzed per boundary
- [ ] Each threat has at least one mitigation

## Time Estimate & Owner
- 1 day (Security Guild, reviewed by Backend)

## Common Pitfalls & Mitigations
- **Pitfall:** Missed trust boundaries  
  **Mitigation:** Review with both backend and ops teams

- **Pitfall:** Mitigations not implemented  
  **Mitigation:** Track as issues and assign to relevant team

- **Pitfall:** Doc not updated after architecture change  
  **Mitigation:** Set review as recurring task in project board