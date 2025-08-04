import prettier from "prettier";

/**
 * Predictive error recovery for consciousness code flows.
 * Exports `recover(errorType, code)` that returns a code patch or fix string.
 */
export function recover(errorType, code) {
  if (errorType === "ReferenceError") {
    // Inject disable at top, flag for later AST rewrite
    return "/* eslint-disable no-undef */\n" + code;
  }
  if (errorType === "TypeError") {
    try {
      // Naive: wrap all dot-accesses with ?. (optional chaining)
      return code.replace(/(\w+)\.(\w+)/g, "$1?.$2");
    } catch {
      return code;
    }
  }
  if (errorType === "SyntaxError") {
    try {
      return prettier.format(code, { parser: "babel" });
    } catch {
      return code;
    }
  }
  // Other errors: no fix
  return "";
}