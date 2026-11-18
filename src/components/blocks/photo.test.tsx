import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Photo } from "./shared";

const render = (props: Partial<Parameters<typeof Photo>[0]>) =>
  renderToStaticMarkup(<Photo sizes="100vw" {...props} />);

// A real photo opens full screen when clicked; a placeholder tile has nothing to open.
describe("Photo preview", () => {
  it("gives a real photo a button named after it", () => {
    const html = render({ src: "/images/home.jpg", alt: "Chef Maria cooking" });
    expect(html).toContain('aria-label="View larger: Chef Maria cooking"');
  });

  it("still names the button when the photo has no alt text", () => {
    expect(render({ src: "/images/home.jpg", alt: "" })).toContain(
      'aria-label="View larger: photo"',
    );
  });

  it("adds no button to the placeholder tile when there is no photo", () => {
    for (const src of [undefined, null, ""]) {
      expect(render({ src })).not.toContain("View larger");
    }
  });

  it("adds no button where it is turned off (a photo inside a link)", () => {
    expect(render({ src: "/images/home.jpg", zoom: false })).not.toContain(
      "View larger",
    );
  });
});
