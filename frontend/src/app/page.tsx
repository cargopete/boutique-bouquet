import { getProducts } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://studiozemya.com";

async function fetchProducts() {
  try {
    return await getProducts();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await fetchProducts();

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary via-cream to-terracotta-light/20 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-clay-brown mb-6 tracking-tight">
              Добре дошли в Studio Zemya
            </h1>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
              Ръчно изработени скулптури, фигурки и бижута от полимерна глина.
              Всяко изделие е уникално — създадено с любов и внимание към
              детайла.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-terracotta"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-ochre"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-sage"></span>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-clay-brown mb-8">
            Нашите Творби
          </h2>
          <ProductGrid products={products} />
        </section>
      </main>

      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Studio Zemya",
            description:
              "Ръчно изработени скулптури, фигурки и бижута от полимерна глина. Уникално изкуство за вашия дом и подаръци с душа.",
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              availableLanguage: "Bulgarian",
            },
            sameAs: [
              // Add social media URLs here when available
              // "https://facebook.com/studiozemya",
              // "https://instagram.com/studiozemya",
            ],
          }),
        }}
      />

      {/* WebSite Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Studio Zemya",
            description:
              "Ръчно изработени скулптури, фигурки и бижута от полимерна глина",
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* ItemList Structured Data for Products */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  description: product.description || product.name,
                  url: `${SITE_URL}/products/${product.id}`,
                  image: product.image_url
                    ? product.image_url.startsWith("http")
                      ? product.image_url
                      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
                    : `${SITE_URL}/placeholder-clay.svg`,
                  offers: {
                    "@type": "Offer",
                    price: parseFloat(product.price),
                    priceCurrency: "BGN",
                    availability:
                      product.stock_quantity > 0
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                  },
                },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
