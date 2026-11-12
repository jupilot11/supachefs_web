import { CmsPage } from "@/components/blocks/cms-page";
import { pageMetadata } from "@/lib/cms/route";

export const generateMetadata = () => pageMetadata("home", "/");

export default function Page() {
  return <CmsPage slug="home" />;
}
