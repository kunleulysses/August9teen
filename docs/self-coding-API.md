# Self-Coding API

## Events

### `code:analyze`
- Initiates static analysis on a module.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "code": "string",
    "options": {}
  }
  ```

### `code:analysis:complete`
- Emitted after analysis finishes.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "analysis": {}
  }
  ```

### `code:analysis:error`
- Emitted when analysis fails.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "error": "string"
  }
  ```

### `code:optimize`
- Requests performance or style optimizations.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "code": "string",
    "constraints": {}
  }
  ```

### `code:optimization:complete`
- Emitted after optimization completes.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "optimization": {}
  }
  ```

### `code:generate`
- Creates a new module from requirements.
- **Payload**
  ```json
  {
    "moduleId": "string",
    "requirements": "string"
  }
  ```

### `system_tick`
- Triggers periodic analysis when capacity is available.

### `consciousness:state_change`
- Updates self-coding behavior based on global system state.

### `consciousness:goal_created`
- Adds new goals to the planning queue.

### `spiral_memory:pattern_detected`
- Prioritizes modules based on observed memory patterns.

## Module Responsibilities

- **CodeAnalyzer** – parses source and produces pattern and metric data.
- **SelfCodingModule** – orchestrates analysis, optimization, and generation and registers all events.
- **AutonomousCodeRefactoringSystem** – performs background refactors during `system_tick`.
- **SigilBasedCodeAuthenticator** – validates generated code signatures.
- **GeminiAIClient/LLM adapter** – provides model-powered generation and refactoring.

