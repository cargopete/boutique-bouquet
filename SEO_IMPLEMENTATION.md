# SEO Implementation Guide

## What We've Implemented ✅

### 1. Enhanced Metadata (All Pages)
- **Root Layout** (`layout.tsx`)
  - Comprehensive Open Graph tags for social sharing
  - Twitter Card tags
  - Bulgarian keywords targeting the local market
  - Proper title template for consistent branding
  - Locale set to `bg_BG`

### 2. Dynamic Product Pages (Server-Side Rendered)
- **Product Pages** (`/products/[id]/page.tsx`)
  - Converted to Server Components for better SEO
  - Dynamic metadata generation for each product
  - Unique titles, descriptions, and images per product
  - Open Graph and Twitter cards for rich social previews
  - JSON-LD structured data (Schema.org Product markup)

### 3. Homepage Enhancements
- **Homepage** (`page.tsx`)
  - Server-side rendering for better crawlability
  - Organization structured data (Schema.org)
  - WebSite structured data with SearchAction
  - ItemList structured data for product catalog

### 4. Technical SEO Files
- **Sitemap** (`sitemap.ts`)
  - Automatically generated from products
  - Updates hourly
  - Includes all public pages

- **Robots.txt** (`robots.ts`)
  - Allows all search engines
  - Blocks admin and API routes
  - References sitemap location

### 5. Structured Data (JSON-LD)
All pages now include proper Schema.org markup:
- **Product pages**: Product schema with offers, pricing, availability
- **Homepage**: Organization, WebSite, and ItemList schemas

## Environment Setup

### Required Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://boutiquet-bouquet.vercel.app
```

Update this with your actual production URL when deploying.

### Optional Variables

```bash
# Google Search Console verification (add after setting up GSC)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

## Testing Your Implementation

### 1. Local Testing

```bash
cd frontend
npm run dev
```

Visit:
- Homepage: http://localhost:3000
- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt

### 2. Validate Structured Data

Use Google's Rich Results Test:
https://search.google.com/test/rich-results

Test URLs:
- Your homepage
- Any product page

### 3. Check Metadata

View page source and verify:
- `<title>` tags are present and descriptive
- `<meta name="description">` is present
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags
- JSON-LD structured data is present

### 4. Social Preview Testing

Test how your pages look when shared:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

## Next Steps (Required Actions)

### 1. Set Up Environment Variables in Vercel

```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://boutiquet-bouquet.vercel.app (or your actual domain)
```

### 2. Create Open Graph Image

Create an image at `public/og-image.jpg`:
- Size: 1200x630 pixels
- Format: JPG or PNG
- Content: Boutique Bouquet logo/branding with flowers
- Include Bulgarian text if possible

### 3. Add Logo

Add your logo to `public/logo.png` for Organization structured data.

### 4. Set Up Google Search Console

1. Go to https://search.google.com/search-console
2. Add your property (your domain)
3. Verify ownership using the HTML tag method:
   - Copy the verification code
   - Add to `layout.tsx` in the `verification.google` field
   - Deploy and verify

4. Submit your sitemap:
   - In Search Console, go to Sitemaps
   - Submit: `https://your-domain.com/sitemap.xml`

### 5. Monitor Search Performance

After 3-7 days, you should start seeing data in Google Search Console:
- Search queries
- Impressions
- Click-through rate
- Average position

### 6. Check Indexing

Use Google Search Console's URL Inspection tool to:
- Check if pages are indexed
- Request indexing for new/updated pages
- See how Google renders your pages

## Bulgarian Keywords Targeted

We've optimized for these Bulgarian search terms:

**Primary Keywords:**
- изкуствени цветя (artificial flowers)
- изкуствени букети (artificial bouquets)
- изкуствени рози (artificial roses)

**Secondary Keywords:**
- букети България (bouquets Bulgaria)
- сватбена декорация (wedding decoration)
- декорация за събития (event decoration)
- изкуствени божури (artificial peonies)
- декорация за дома (home decoration)
- изкуствени орхидеи (artificial orchids)
- изкуствени лилии (artificial lilies)

## Performance Tips

### Image Optimization
Ensure all product images are:
- Optimized (compressed)
- Properly sized (max 1920px width)
- Have descriptive Bulgarian alt text
- Use Next.js Image component (already implemented)

### Loading Speed
- Vercel automatically optimizes your deployment
- Monitor Core Web Vitals in Vercel Analytics
- Aim for:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

## Structured Data Validation

Your pages now include:

**Homepage:**
- Organization schema (company info)
- WebSite schema (search functionality)
- ItemList schema (product catalog)

**Product Pages:**
- Product schema (individual products)
- Offer schema (pricing, availability)

Validate using:
- https://validator.schema.org/
- https://search.google.com/test/rich-results

## Common Issues & Fixes

### Issue: Sitemap shows 404
**Fix:** Ensure you've deployed the `sitemap.ts` file and the API is accessible.

### Issue: No products in sitemap
**Fix:** Check that your API_URL is correct and products endpoint is working.

### Issue: Social previews not updating
**Fix:** Use the Facebook Debugger to scrape fresh data. Twitter/LinkedIn cache for 7 days.

### Issue: Google not indexing pages
**Fix:**
- Check robots.txt isn't blocking
- Submit sitemap in Search Console
- Use "Request Indexing" for important pages
- Ensure pages are publicly accessible (no auth required)

## Files Modified

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Enhanced metadata
│   │   ├── page.tsx                # Server component with structured data
│   │   ├── sitemap.ts              # NEW: Dynamic sitemap
│   │   ├── robots.ts               # NEW: Robots.txt
│   │   └── products/
│   │       └── [id]/
│   │           └── page.tsx        # Server component with metadata
│   └── components/
│       ├── ProductDetail.tsx       # NEW: Client component for interactivity
│       └── ProductGrid.tsx         # NEW: Client component for product grid
└── .env.example                    # Updated with new env vars
```

## Monitoring & Analytics

### Recommended Tools (Free Tier Available)

1. **Google Search Console** (Free)
   - Search performance
   - Indexing status
   - Core Web Vitals

2. **Vercel Analytics** (Free tier)
   - Real User Monitoring
   - Web Vitals
   - Page views

3. **Google Analytics 4** (Free)
   - User behavior
   - Conversion tracking
   - E-commerce events

4. **Bing Webmaster Tools** (Free)
   - Similar to Google Search Console
   - Submit sitemap

## Expected Results

**Week 1-2:**
- Google discovers and indexes your pages
- Sitemap processed
- Pages appear in "site:" searches

**Week 3-4:**
- Start appearing in search results
- Low position (page 5-10)
- Impressions increase

**Month 2-3:**
- Ranking improvements for Bulgarian keywords
- Click-through rate stabilizes
- Product pages ranking individually

**Month 3-6:**
- Established rankings for target keywords
- Organic traffic grows
- Brand searches increase

## Support & Validation

### Validation Checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] All product pages have unique titles and descriptions
- [ ] Structured data validates with no errors
- [ ] Open Graph images display correctly
- [ ] Pages render correctly in Google Search Console
- [ ] Environment variables set in Vercel
- [ ] Google Search Console set up and verified
- [ ] Sitemap submitted to Google Search Console

### Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Product Documentation](https://schema.org/Product)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

---

**All SEO fundamentals are now in place!** 🎯

The technical foundation is solid. Focus next on:
1. Quality product descriptions in Bulgarian
2. Building backlinks from Bulgarian websites
3. Creating valuable content (blog posts)
4. Monitoring and iterating based on Search Console data
