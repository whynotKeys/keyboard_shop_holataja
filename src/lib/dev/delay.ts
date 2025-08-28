export async function devDelay(ms = 1200) {
  if (process.env.NODE_ENV !== 'development') return;
  await new Promise(r => setTimeout(r, ms));
}
