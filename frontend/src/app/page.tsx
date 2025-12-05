import { getProducts } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://boutiquet-bouquet.vercel.app";

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
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-rose-100 to-pink-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Добре дошли в Boutique Bouquet 💐
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Висококачествени изкуствени цветя и букети за всеки повод.
              Красота, която трае завинаги.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Нашите Продукти
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
            name: "Boutique Bouquet",
            description:
              "Магазин за изкуствени цветя и букети в България. Висококачествени изкуствени рози, лилии, орхидеи и други цветя за всеки повод.",
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              availableLanguage: "Bulgarian",
            },
            sameAs: [
              // Add social media URLs here when available
              // "https://facebook.com/boutiquebouquet",
              // "https://instagram.com/boutiquebouquet",
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
            name: "Boutique Bouquet",
            description:
              "Магазин за изкуствени цветя и букети в България",
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
                    : `${SITE_URL}/placeholder-flower.jpg`,
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
