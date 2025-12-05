# Observability & Metrics Guide

## Prometheus Metrics (Backend)

### What's Implemented

The Rust backend now exposes Prometheus metrics at `/metrics` endpoint.

**Automatic Metrics Tracked:**
- HTTP request count (by method, endpoint, status code)
- HTTP request duration (histograms with percentiles)
- HTTP requests in flight (current concurrent requests)
- Response times (p50, p90, p95, p99)

**Endpoint:** `http://localhost:8000/metrics` (or your backend URL)

### Viewing Metrics

#### Local Testing

Start your backend and visit:
```bash
curl http://localhost:8000/metrics
```

You'll see output like:
```
# HELP http_requests_total Total number of HTTP requests made
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/api/products",status="200"} 42

# HELP http_requests_duration_seconds HTTP request duration
# TYPE http_requests_duration_seconds histogram
http_requests_duration_seconds_bucket{method="GET",path="/api/products",le="0.005"} 35
http_requests_duration_seconds_bucket{method="GET",path="/api/products",le="0.01"} 40
...
```

### Grafana Cloud Setup (Free Tier)

1. **Sign up for Grafana Cloud**
   - Go to https://grafana.com/auth/sign-up/create-user
   - Free tier includes:
     - 10k series for Prometheus metrics
     - 14 days retention
     - 50GB logs
     - 3 users

2. **Get Your Prometheus Remote Write Endpoint**
   - In Grafana Cloud, go to "Connections" → "Add new connection"
   - Select "Prometheus"
   - Copy your remote write URL and credentials

3. **Set Up Prometheus Server** (or use Grafana Agent)

   **Option A: Using Docker Compose (Recommended)**

   Add to your `docker-compose.yml`:
   ```yaml
   prometheus:
     image: prom/prometheus:latest
     volumes:
       - ./prometheus.yml:/etc/prometheus/prometheus.yml
     ports:
       - "9090:9090"
     networks:
       - app-network
   ```

   Create `prometheus.yml`:
   ```yaml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'boutique-bouquet-api'
       static_configs:
         - targets: ['backend:8000']

   remote_write:
     - url: 'YOUR_GRAFANA_CLOUD_REMOTE_WRITE_URL'
       basic_auth:
         username: 'YOUR_USERNAME'
         password: 'YOUR_PASSWORD'
   ```

   **Option B: Using Grafana Agent (Lighter)**

   Add to `docker-compose.yml`:
   ```yaml
   grafana-agent:
     image: grafana/agent:latest
     volumes:
       - ./agent-config.yaml:/etc/agent/agent.yaml
     networks:
       - app-network
   ```

   Create `agent-config.yaml`:
   ```yaml
   metrics:
     wal_directory: /tmp/grafana-agent-wal
     global:
       scrape_interval: 15s
       remote_write:
         - url: 'YOUR_GRAFANA_CLOUD_REMOTE_WRITE_URL'
           basic_auth:
             username: 'YOUR_USERNAME'
             password: 'YOUR_PASSWORD'
     configs:
       - name: default
         scrape_configs:
           - job_name: 'boutique-bouquet-api'
             static_configs:
               - targets: ['backend:8000']
   ```

4. **Create Dashboards in Grafana**

   Once metrics are flowing:
   - Go to Grafana Cloud dashboard
   - Create a new dashboard
   - Add panels with PromQL queries

### Useful PromQL Queries

**Request Rate (requests per second):**
```promql
rate(http_requests_total[5m])
```

**Request Rate by Endpoint:**
```promql
sum by (path) (rate(http_requests_total[5m]))
```

**Error Rate:**
```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
```

**Request Duration (95th percentile):**
```promql
histogram_quantile(0.95, rate(http_requests_duration_seconds_bucket[5m]))
```

**Requests In Flight:**
```promql
http_requests_in_flight
```

**Top 5 Slowest Endpoints:**
```promql
topk(5, histogram_quantile(0.95, rate(http_requests_duration_seconds_bucket[5m])))
```

### Pre-built Dashboard

You can import a pre-built dashboard for Axum metrics:
1. Go to Grafana → Dashboards → Import
2. Use Dashboard ID: `14031` (generic HTTP metrics)
3. Adjust for your metric names if needed

Or create custom panels with these visualizations:

**Panel 1: Request Rate**
- Query: `sum(rate(http_requests_total[5m]))`
- Visualization: Graph
- Title: "Requests per Second"

**Panel 2: Error Rate**
- Query: `sum(rate(http_requests_total{status=~"5.."}[5m]))`
- Visualization: Graph
- Title: "Error Rate (5xx)"

**Panel 3: Response Time (p95)**
- Query: `histogram_quantile(0.95, rate(http_requests_duration_seconds_bucket[5m]))`
- Visualization: Graph
- Title: "Response Time (95th percentile)"

**Panel 4: Requests by Endpoint**
- Query: `sum by (path) (rate(http_requests_total[5m]))`
- Visualization: Bar Chart
- Title: "Requests by Endpoint"

### Alerting

Set up alerts in Grafana:

**High Error Rate:**
```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) > 1
```

**High Latency:**
```promql
histogram_quantile(0.95, rate(http_requests_duration_seconds_bucket[5m])) > 1
```

**Service Down:**
```promql
up{job="boutique-bouquet-api"} == 0
```

### Production Deployment

For production, ensure:
1. `/metrics` endpoint is not publicly accessible
2. Use firewall rules or network policies to restrict access
3. Consider using mTLS for scraping

Add to your Nginx config:
```nginx
location /metrics {
    deny all;
    return 404;
}
```

Or in your backend, add authentication for metrics endpoint if needed.

## GDPR Cookie Consent (Frontend)

### What's Implemented

A GDPR-compliant cookie consent banner that:
- Shows on first visit
- Saves consent to localStorage
- Written in Bulgarian
- Appears at bottom of screen
- Non-intrusive design

### How It Works

**Storage Key:** `bb_cookie_consent`

**Behavior:**
1. On first visit, banner appears after 1 second
2. User clicks "Разбрах" (I understand)
3. Consent saved to localStorage
4. Banner never shows again (unless localStorage is cleared)

**Location:** Bottom of all pages via root layout

### Customization

Edit `/frontend/src/components/CookieConsent.tsx` to:
- Change text
- Add "Decline" button if needed
- Add link to privacy policy
- Change styling
- Add analytics opt-in/opt-out logic

### Compliance Notes

Current implementation:
- ✅ Informs users about cookies
- ✅ Allows acceptance
- ✅ Remembers preference
- ✅ In Bulgarian

For stricter compliance (GDPR Article 7):
- Consider adding explicit opt-in before setting any cookies
- Add "Privacy Policy" link
- Add granular cookie preferences (necessary, analytics, marketing)
- Consider adding "Reject All" button

## Future Enhancements

### Backend
- [ ] Custom business metrics (orders created, revenue, product views)
- [ ] Database connection pool metrics
- [ ] PostgreSQL query metrics via pg_stat_statements
- [ ] Distributed tracing with OpenTelemetry
- [ ] Sentry for error tracking

### Frontend
- [ ] Vercel Analytics (just enable in dashboard)
- [ ] PostHog for product analytics
- [ ] Sentry for client-side errors
- [ ] User session tracking
- [ ] Conversion funnel tracking

## Monitoring Checklist

- [ ] Prometheus scraping backend successfully
- [ ] Grafana dashboards created
- [ ] Alerts configured in Grafana
- [ ] Cookie consent banner tested
- [ ] Metrics retention configured
- [ ] Backup strategy for metrics data
- [ ] Team access to Grafana configured

## Costs

**Grafana Cloud Free Tier:**
- 10k active series
- 50GB logs
- 50GB traces
- 14 days retention
- 3 users

**Paid Tier (if needed):**
- Starts at ~$8/month for more metrics
- Pay-as-you-go for overage

**Alternative: Self-hosted**
- Run Prometheus + Grafana in Docker
- Free but requires maintenance
- Good for development/testing

---

**Your backend now has full HTTP metrics tracking!** 📊

Access metrics at: `http://your-backend-url/metrics`
