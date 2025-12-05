# Boutique Bouquet - Improvements Roadmap

## 🔭 Observability & Metrics

### Frontend (Next.js/Vercel)

- [ ] Enable Vercel Web Analytics
  - Built-in, just needs enabling in Vercel dashboard
  - Tracks page views, Web Vitals, user sessions

- [ ] Enable Vercel Speed Insights
  - Real User Monitoring (RUM)
  - Core Web Vitals tracking
  - Performance bottleneck identification

- [ ] Set up Sentry for error tracking
  - Install `@sentry/nextjs`
  - Capture client-side errors
  - Capture Server Component errors
  - Source map upload for readable stack traces
  - User feedback integration

- [ ] Add privacy-friendly analytics
  - PostHog (product analytics + session replay)
  - OR Plausible (simple, GDPR-compliant)
  - OR Fathom Analytics
  - Important: GDPR compliance for Bulgarian/EU market

- [ ] Implement custom event tracking
  - Track product views
  - Track add-to-cart events
  - Track checkout funnel steps
  - Track order completions

- [ ] Set up conversion tracking
  - Google Analytics 4 (optional, but useful for ads)
  - Facebook Pixel (if running FB ads)
  - Track e-commerce events

### Backend (Rust/Axum)

- [ ] Implement structured logging with `tracing`
  - Already likely using `tracing` crate
  - Ensure proper log levels (info, warn, error)
  - Add request IDs for correlation

- [ ] Add OpenTelemetry instrumentation
  - Install `tracing-opentelemetry` crate
  - Install `opentelemetry` and `opentelemetry-otlp`
  - Instrument HTTP requests (middleware)
  - Instrument database queries
  - Instrument external API calls
  - Export to collector (Grafana Cloud, Honeycomb, etc.)

- [ ] Set up Prometheus metrics
  - Install `axum-prometheus` crate
  - Expose `/metrics` endpoint
  - Track request duration, request count
  - Track database connection pool stats
  - Track custom business metrics (orders/min, revenue, etc.)

- [ ] Add Sentry for Rust backend
  - Install `sentry` crate
  - Capture panics and errors
  - Match Sentry project with frontend for correlation

- [ ] Implement health checks
  - Enhance existing `/api/health` endpoint
  - Add database connectivity check
  - Add external dependency checks
  - Expose readiness and liveness probes

- [ ] Set up log aggregation
  - Stream logs to Axiom, Grafana Loki, or Datadog
  - Retain logs for debugging
  - Set up log-based alerts

### Distributed Tracing

- [ ] Implement end-to-end tracing
  - Propagate trace context from Next.js to Axum
  - Use W3C Trace Context headers
  - Visualize request flow across services

- [ ] Set up dashboards
  - Grafana dashboard for system metrics
  - Service map showing frontend → backend → database
  - Error rate and latency percentiles

### Alerting

- [ ] Set up error alerts
  - Sentry alerts for high error rates
  - Slack/Discord/Email notifications

- [ ] Set up performance alerts
  - Alert on high API latency (p95 > threshold)
  - Alert on database connection pool exhaustion
  - Alert on high error rates

- [ ] Set up business metric alerts
  - Alert on zero orders for extended period
  - Alert on failed payment rate spike

### Database Monitoring

- [ ] Enable PostgreSQL query logging
  - Log slow queries (> 100ms)
  - Identify N+1 queries

- [ ] Monitor database metrics
  - Connection pool utilization
  - Query performance
  - Table/index sizes
  - Lock contention

## 🎯 SEO & Discoverability

### Technical SEO Foundations

- [ ] Implement Next.js Metadata API
  - Set proper `<title>` tags (Bulgarian)
  - Set `<meta name="description">` (Bulgarian)
  - Set Open Graph tags for social sharing
  - Set Twitter Card tags
  - Ensure proper `<html lang="bg">`

- [ ] Generate dynamic sitemap.xml
  - Create `app/sitemap.ts`
  - Include all product pages
  - Include category pages
  - Include blog posts (if added)
  - Submit to Google Search Console

- [ ] Create robots.txt
  - Create `app/robots.ts`
  - Allow all crawlers
  - Reference sitemap location

- [ ] Implement structured data (JSON-LD)
  - Product schema for all product pages
  - Organization schema for homepage
  - BreadcrumbList schema for navigation
  - AggregateRating schema (when reviews added)
  - Use Google Rich Results Test to validate

- [ ] Set up canonical URLs
  - Prevent duplicate content issues
  - Handle URL variations properly

- [ ] Optimize Core Web Vitals
  - Ensure LCP < 2.5s
  - Ensure FID < 100ms
  - Ensure CLS < 0.1
  - Use Vercel Speed Insights to monitor

### Image Optimization

- [ ] Optimize product images
  - Use Next.js `<Image>` component (likely already done)
  - Serve WebP/AVIF formats
  - Implement lazy loading
  - Set proper image dimensions

- [ ] Add Bulgarian alt text to all images
  - Descriptive alt text for accessibility
  - Include keywords naturally
  - Don't keyword stuff

### Content & Keywords (Bulgarian)

- [ ] Research Bulgarian keywords
  - Use Google Keyword Planner for Bulgarian market
  - Identify long-tail keywords
  - Analyze competitor keywords

- [ ] Optimize product pages for Bulgarian search
  - Target keywords in titles, descriptions
  - Natural Bulgarian language (not translated from English)
  - Include:
    - "изкуствени цветя" (artificial flowers)
    - "изкуствени рози" (artificial roses)
    - "букети" (bouquets)
    - "декорация за събития" (event decoration)
    - "сватбена декорация" (wedding decoration)
    - "изкуствени божури" (artificial peonies)
    - "декорация за рожден ден" (birthday decoration)

- [ ] Create category/collection pages
  - Roses collection
  - Wedding flowers collection
  - Event decoration collection
  - Seasonal collections
  - Each optimized for specific Bulgarian keywords

- [ ] Write Bulgarian blog content
  - "Как да изберем изкуствени цветя за сватба"
  - "10 начина да декорирате с изкуствени рози"
  - "Предимства на изкуствените цветя пред естествените"
  - "Как да почистваме изкуствени цветя"
  - Seasonal content (Valentine's, 8th March, weddings)

- [ ] Create FAQ page
  - Answer common questions in Bulgarian
  - Target long-tail queries
  - Implement FAQ schema markup

### URL Structure

- [ ] Ensure SEO-friendly URLs
  - Use Bulgarian slugs where appropriate
  - Keep URLs short and descriptive
  - Use hyphens (not underscores)
  - Example: `/products/izkustveni-rozi-cherven` instead of `/products/123`

### Mobile Optimization

- [ ] Verify mobile-first design
  - Test on Bulgarian mobile networks
  - Ensure tap targets are large enough
  - Test forms on mobile
  - Ensure fast mobile load times

### Local SEO (Bulgaria)

- [ ] Set up Google Business Profile
  - If physical location exists
  - Add Bulgarian business information
  - Add photos of products
  - Collect reviews

- [ ] Submit to Bulgarian directories
  - Local Bulgarian business listings
  - Wedding/event planning directories
  - E-commerce directories

- [ ] Get listed on Bulgarian wedding sites
  - Partner with wedding blogs
  - Get featured on Bulgarian wedding planning sites

### Link Building

- [ ] Build Bulgarian backlinks
  - Guest posts on Bulgarian blogs
  - Partner with Bulgarian event planners
  - Get featured in Bulgarian wedding magazines
  - Partner with Bulgarian influencers

- [ ] Internal linking strategy
  - Link from blog posts to products
  - Link between related products
  - Create hub pages that link to clusters

### Social Media Integration

- [ ] Set up social media presence
  - Facebook (very popular in Bulgaria)
  - Instagram (visual product showcase)
  - Pinterest (wedding inspiration)
  - Share products with proper Bulgarian descriptions

- [ ] Add social sharing buttons
  - Easy sharing from product pages
  - Share cart/wishlist features

### Performance & Hosting

- [ ] Optimize Vercel configuration
  - Ensure Edge runtime where beneficial
  - Configure caching headers properly
  - Use ISR for product pages

- [ ] Set up CDN for images
  - Vercel already provides this
  - Ensure proper cache headers

- [ ] Consider European edge regions
  - Ensure Vercel serves from European edge nodes
  - Minimize latency for Bulgarian users

### Search Console & Analytics Setup

- [ ] Set up Google Search Console
  - Verify domain ownership
  - Submit sitemap
  - Monitor search performance
  - Fix crawl errors

- [ ] Set up Bing Webmaster Tools
  - Less traffic but still valuable
  - Submit sitemap

- [ ] Monitor search rankings
  - Track Bulgarian keyword rankings
  - Use tools like Ahrefs, SEMrush, or SerpApi

### Conversion Optimization

- [ ] Implement trust signals
  - Customer reviews/testimonials (in Bulgarian)
  - Security badges
  - Return policy clearly stated
  - Contact information prominent

- [ ] A/B testing setup
  - Test different CTAs
  - Test different product descriptions
  - Test different pricing displays

### Internationalization (Future)

- [ ] Prepare for potential expansion
  - Structure content for easy translation
  - Consider Greek, Romanian, Serbian markets
  - Use i18n routing in Next.js

## 💰 Cost Considerations

### Free Tier Options
- Vercel Analytics: Free tier available
- Sentry: Free tier (5k errors/month)
- Grafana Cloud: Free tier (generous)
- PostHog: Free tier (1M events/month)
- Plausible: Paid only (~9€/month)

### Recommended Paid Services (if budget allows)
- Sentry Business: ~$26/month (better for production)
- Axiom: ~$25/month (great for logs)
- PostHog Scale: Pay per usage (cost-effective)

## 🎯 Quick Wins (Start Here)

1. Enable Vercel Analytics (5 minutes)
2. Add proper metadata to product pages (1-2 hours)
3. Generate sitemap.xml (30 minutes)
4. Add structured data to products (2-3 hours)
5. Set up Google Search Console (30 minutes)
6. Add Sentry to both frontend and backend (2-3 hours)

## 📊 Success Metrics

### Observability
- Mean time to detect (MTtd) < 5 minutes
- Mean time to resolve (MTTR) < 1 hour
- Error rate < 0.1%
- API latency p95 < 200ms

### SEO
- Organic traffic growth month-over-month
- Top 10 rankings for primary Bulgarian keywords
- Conversion rate from organic traffic
- Average session duration > 2 minutes
- Bounce rate < 60%
