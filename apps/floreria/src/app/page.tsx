import { content } from "@/lib/content";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSlider } from "@/components/HeroSlider";
import { CategorySection } from "@/components/CategorySection";
import { HowToOrder } from "@/components/HowToOrder";
import { VisitUs } from "@/components/VisitUs";
import { CartDialog } from "@/components/cart/CartDialog";

export default function Home() {
  const { store, heroSlides, catalog } = content;
  return (
    <>
      <SiteHeader name={store.name} categories={catalog} />
      <main>
        <HeroSlider slides={heroSlides} />
        <div id="catalogo" className="container">
          {catalog.map((c) => (
            <CategorySection key={c.id} category={c} />
          ))}
          <HowToOrder />
        </div>
      </main>
      <VisitUs store={store} />
      <CartDialog whatsapp={store.whatsapp} deliveryNote={store.deliveryNote} />
    </>
  );
}
