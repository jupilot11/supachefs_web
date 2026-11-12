import { CmsPage } from "@/components/blocks/cms-page";
import { pageMetadata } from "@/lib/cms/route";

export const generateMetadata = () =>
  pageMetadata("how-it-works-chefs", "/how-it-works/chefs");

export default function Page() {
  return <CmsPage slug="how-it-works-chefs" />;
}
