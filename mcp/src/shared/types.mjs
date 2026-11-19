// Shared types (JSDoc, so editors autocomplete without TypeScript) and the few constants every tool uses.

/**
 * One tool = one file in src/tools/, default-exporting this shape. The registry turns it into an MCP tool.
 * @typedef {object} ToolDef
 * @property {string} name          snake_case verb_noun, e.g. list_failures
 * @property {string} title         short human title (shown in clients)
 * @property {string} description   for the AI: when to use it and what it returns (1-3 sentences)
 * @property {Record<string, import('zod').ZodType>} input   zod fields (see shared/schemas.mjs)
 * @property {object} annotations   READ_ONLY or ACTION (+ destructiveHint when it changes data)
 * @property {(input: any, ctx: Ctx, extra?: any) => Promise<ToolAnswer>} run
 */

/**
 * @typedef {object} ToolAnswer
 * @property {string} text   short Markdown for people and the AI (summary first)
 * @property {object} data   the same facts as plain JSON (structuredContent); always an object, never an array
 */

/**
 * What every tool receives (built once in create-server.mjs).
 * @typedef {object} Ctx
 * @property {ReturnType<typeof import('../config.mjs').loadConfig>} config
 * @property {Logger} log
 * @property {ReturnType<typeof import('../adapters/reports.mjs').createReportStore>} reports
 * @property {ReturnType<typeof import('../services/jobs.mjs').createJobs>} jobs
 * @property {(text: string) => string} mask   hides .env secrets
 */

/** @typedef {{ error: Function, warn: Function, info: Function, debug: Function }} Logger */

/** An expected problem (wrong id, nothing recorded, device not ready): its message goes to the AI as-is. */
export class ToolError extends Error {}
export const fail = (message) => { throw new ToolError(message); };

export const READ_ONLY = Object.freeze({ readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });
export const ACTION = Object.freeze({ readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false });
