// Pass-through to the real Laravel API on :8080. If /tmp/home-title.txt exists, the home hero title
// is replaced in the response: a stand-in for publishing a change in the admin (web/ is read-only here).
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";

createServer(async (req, res) => {
  const up = await fetch(`http://localhost:8080${req.url}`, {
    headers: {
      accept: "application/json",
      "x-site-secret": req.headers["x-site-secret"] ?? "",
    },
  });
  let body = await up.text();
  if (
    req.url.startsWith("/api/v1/site/pages/home") &&
    existsSync("/tmp/home-title.txt")
  ) {
    const j = JSON.parse(body);
    j.sections[0].data.title = readFileSync(
      "/tmp/home-title.txt",
      "utf8",
    ).trim();
    body = JSON.stringify(j);
  }
  console.log(
    req.method,
    req.url,
    up.status,
    req.headers["x-site-secret"] ? "(secret sent)" : "(no secret)",
  );
  res.writeHead(up.status, { "content-type": "application/json" });
  res.end(body);
}).listen(4020, () => console.log("proxy on 4020"));
