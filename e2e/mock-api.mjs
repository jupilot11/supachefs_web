// Stand-in for the Laravel chef-leads endpoint (site reads come from CMS_FIXTURES=1).
// full_name containing "ratelimit" -> 429, "boom" -> 500, "dupe" -> 422, otherwise 201.
import { createServer } from "node:http";

createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "POST" || req.url !== "/api/v1/site/chef-leads") {
      res.statusCode = 404;
      return res.end("{}");
    }
    if (req.headers["x-site-secret"] !== "dev-server-secret") {
      res.statusCode = 403;
      return res.end("{}");
    }
    const name = JSON.parse(body || "{}").full_name ?? "";
    if (name.includes("ratelimit")) res.statusCode = 429;
    else if (name.includes("boom")) res.statusCode = 500;
    else if (name.includes("dupe")) {
      res.statusCode = 422;
      return res.end(
        JSON.stringify({
          message: "The given data was invalid.",
          errors: { mobile: ["That number already applied."] },
        }),
      );
    } else res.statusCode = 201;
    res.end(JSON.stringify({ id: 12 }));
  });
}).listen(4010, () => console.log("mock api on 4010"));
