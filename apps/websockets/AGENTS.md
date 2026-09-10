# AGENTS.md — WebSocket Service Directives

Specific development guidelines for `apps/websockets`.

---

## 🎯 Directives & Principles

1. **Connection & Event Lifecycle Management**:
   - Always handle connection errors (`ws.on('error')`) and disconnection (`ws.on('close')`) to prevent socket leaks or silent crashes.
   - Clean up socket listeners and room subscriptions on connection teardown.

2. **Payload Parsing & Validation**:
   - Always safely parse incoming data strings (`JSON.parse` with try/catch) before attempting to read message attributes.
   - Validate event types and payload schemas before broadcasting or updating database state.

3. **Logging & Debugging**:
   - Use `logger.info(...)` and `logger.error(...)` with structured metadata objects. Do not use raw `console.log`.

4. **Port Configuration**:
   - Service listens on port `6000` (`ws://localhost:6000`). Maintain port consistency across documentation and client socket initializations.
