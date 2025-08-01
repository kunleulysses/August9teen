## [Spiral] Sprint 1: Consolidation

- Introduced core/SpiralMemoryFacade.js as the single authoritative API for spiral memory.
- Deprecated intelligent-spiral-memory.js (now a shim to the Facade with deprecation warning).
- All src/ modules migrated to import the Facade instead of the legacy module.
- EventBus event keys now use spiral.memory.* namespace; both legacy and new keys are supported for backward compatibility.
- No changes to SpiralMemoryArchitecture internals in this phase.