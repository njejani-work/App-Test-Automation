// Code under test for the demo unit runs (test/dashboard/fixtures.mjs). DEMO_FAIL=1 makes two tests fail.
export const cleanPhone = (p) => String(p).replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
export const maskOtp = (code) => (process.env.DEMO_FAIL ? code : '•'.repeat(String(code).length));
export function layoutBox(el, screen) {
  if (!screen) throw new TypeError('screen size is missing');
  return { y: Math.round((el.y / screen.h) * 1000) / 10 };
}
export const unused = () => 'never called (shows as uncovered)';
