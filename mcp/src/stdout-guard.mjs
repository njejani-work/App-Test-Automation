// Imported FIRST by the entry point. Over stdio, stdout carries the MCP messages: one stray console.log (ours or from
// a dashboard module we reuse) would break the conversation, so everything printed goes to stderr instead.
console.log = console.info = console.debug = (...a) => console.error(...a);
