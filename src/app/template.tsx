// Route enter: an 8px rise (see .route-enter in globals.css). Transform only, so the page is
// visible in the server HTML and nothing waits for JavaScript. Templates remount on navigation.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
