import { createFileRoute } from "@tanstack/react-router";
import { MerchandiseSection } from "@/components/home-extras";
import { PageTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/merchandise")({
  head: () => ({ meta: [
    { title: "Official Merchandise — Courtside" },
    { name: "description", content: "Browse mock Courtside merchandise products and prices." },
    { property: "og:title", content: "Official Merchandise — Courtside" },
    { property: "og:description", content: "Browse mock Courtside merchandise products and prices." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Merchandise,
});

function Merchandise() {
  return <>
    <PageTitle title="Official Merchandise" sub="Demo collection · mock products and prices" />
    <MerchandiseSection />
  </>;
}
