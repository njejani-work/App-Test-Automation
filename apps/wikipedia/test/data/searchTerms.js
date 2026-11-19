// Test data. Override in .env without touching code.
// Pick articles that surely exist on English Wikipedia and whose title is unique enough
// that the first result containing it is the article itself.
export const SEARCH_TERM = process.env.SEARCH_TERM || 'Albert Einstein';
export const SECOND_SEARCH_TERM = process.env.SECOND_SEARCH_TERM || 'Android (operating system)';
