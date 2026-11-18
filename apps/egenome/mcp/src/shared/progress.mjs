// MCP progress notifications: only sent when the client asked for them (it passed a progressToken).
export function progressSender(extra) {
  const token = extra?._meta?.progressToken;
  let n = 0;
  return (message, total) => {
    if (token === undefined) return;
    extra.sendNotification({ method: 'notifications/progress', params: { progressToken: token, progress: ++n, ...(total ? { total } : {}), message } }).catch(() => {});
  };
}
