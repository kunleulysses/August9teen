# Featherweight.world Homepage & UI Customization Handoff

## 🎯 **Objective**
Create a professional homepage for **featherweight.world** that serves as a landing page with navigation to the spiral memory visualization and metrics dashboard, while customizing the UI colors and fonts to match the user's brand preferences.

## 📊 **Current State**

### ✅ **What's Already Working:**
- **🌀 Spiral Memory 3D Visualization:** https://featherweight.world/ (currently serving as root)
- **📊 Live Metrics Dashboard:** https://featherweight.world/metrics
- **⚛️ API Endpoint:** https://featherweight.world/api/memory-data
- **🔍 Health Check:** https://featherweight.world/health
- **🔒 SSL/HTTPS:** Full Let's Encrypt certificates configured
- **🌐 Domain:** Main featherweight.world domain properly configured with nginx

### 🗂️ **Current File Structure:**
```
/opt/featherweight/FlappyJournal/
├── spiral-memory-3d-visualization.html          # Current 3D visualization (in container)
├── spiral-memory-live-metrics.js               # Live metrics dashboard logic
├── spiral-memory-ascii-3d.cjs                  # Terminal ASCII visualization
├── spiral-memory-visualization-server.cjs      # Original server (reference)
└── mechanismdocs/
    ├── SPIRAL_MEMORY_VISUALIZATION_DEPLOYMENT_HANDOFF.md
    └── FEATHERWEIGHT_HOMEPAGE_UI_CUSTOMIZATION_HANDOFF.md (this file)

Container Files (consciousness-web):
/opt/app/
├── public/
│   └── index.html                               # Current 3D visualization
├── server/
│   └── simple-web-server.js                    # ES module spiral memory server
└── spiral-memory-live-metrics.js               # Live metrics logic
```

### 🌐 **Current Nginx Configuration:**
- **Main Domain:** `/etc/nginx/sites-available/featherweight-main`
- **SSL Certs:** `/etc/letsencrypt/live/featherweight.world/`
- **Proxy Target:** `localhost:3000` (consciousness-web container)

### 💻 **Current Server Architecture:**
- **Container:** `consciousness-web` (running ES module Node.js server)
- **Port:** 3000 (internal)
- **Nginx:** HTTPS proxy on port 443
- **Framework:** Standalone HTTP server with Three.js frontend

## 🎨 **Requested Changes**

### 1. **Homepage Creation**
- Create a new homepage at https://featherweight.world/
- Move current 3D visualization to https://featherweight.world/visualization
- Homepage should include:
  - Professional landing page design
  - Clear navigation to spiral memory features
  - Links to visualization and metrics dashboard
  - Brand-appropriate styling

### 2. **UI Color & Font Customization**
- Update color scheme across all pages
- Implement consistent font styling
- Ensure brand cohesion across visualization, metrics, and homepage
- Maintain professional presentation quality

## 🛠️ **Implementation Steps**

### **Step 1: Backup Current State**
```bash
# Backup current files before modifications
docker cp consciousness-web:/opt/app/public/index.html /tmp/spiral-3d-visualization-backup.html
docker cp consciousness-web:/opt/app/server/simple-web-server.js /tmp/spiral-server-backup.js
```

### **Step 2: Create Homepage Structure**
1. **Create new homepage file:** `/tmp/featherweight-homepage.html`
2. **Move current visualization:** Update server to serve 3D visualization at `/visualization`
3. **Update routing:** Modify server routes to handle homepage vs visualization

### **Step 3: Update Server Routes**
Modify `/opt/app/server/simple-web-server.js` to handle:
```javascript
// Homepage at root /
if (pathname === '/') {
    filePath = path.join(this.publicDir, 'homepage.html');
}
// 3D Visualization at /visualization  
else if (pathname === '/visualization') {
    filePath = path.join(this.publicDir, 'spiral-3d-visualization.html');
}
```

### **Step 4: UI Customization**
1. **Define color palette** - coordinate with user for brand colors
2. **Select professional fonts** - implement Google Fonts or system fonts
3. **Update CSS across all pages:**
   - Homepage styling
   - 3D visualization interface
   - Metrics dashboard styling
4. **Ensure consistency** in visual elements

### **Step 5: Deployment**
```bash
# Copy files to container
docker cp /tmp/featherweight-homepage.html consciousness-web:/opt/app/public/homepage.html
docker cp /tmp/spiral-3d-visualization.html consciousness-web:/opt/app/public/spiral-3d-visualization.html
docker cp /tmp/updated-server.js consciousness-web:/opt/app/server/simple-web-server.js

# Restart container
docker restart consciousness-web
```

### **Step 6: Testing & Validation**
- ✅ https://featherweight.world/ → Homepage
- ✅ https://featherweight.world/visualization → 3D Spiral Memory
- ✅ https://featherweight.world/metrics → Live Metrics Dashboard
- ✅ https://featherweight.world/api/memory-data → API Endpoint
- ✅ All UI elements styled consistently

## 🎨 **UI Design Considerations**

### **Color Scheme Options:**
- **Option 1 - Quantum Blue:** Deep blues, cyans, electric accents
- **Option 2 - Golden Ratio:** Golds, ambers, warm sophistication  
- **Option 3 - Consciousness Purple:** Deep purples, magentas, ethereal
- **Option 4 - User Custom:** Coordinate with user for brand colors

### **Typography Recommendations:**
- **Headers:** Modern sans-serif (Inter, Roboto, Montserrat)
- **Body:** Clean readable fonts (System UI, Segoe UI, Arial)
- **Code/Data:** Monospace fonts (Courier New, Monaco, Fira Code)

### **Design Elements:**
- Maintain golden ratio mathematical aesthetics
- Keep spiral/circular design motifs
- Ensure accessibility (contrast ratios, readability)
- Mobile-responsive design
- Professional presentation quality for investors

## 🔧 **Technical Considerations**

### **Container Environment:**
- **ES Modules:** Use `import/export` syntax (not `require()`)
- **File Paths:** All paths relative to `/opt/app/`
- **Port:** Server must listen on port 3000
- **Restart:** Container restart required for server changes

### **CSS/Styling Approach:**
- **Inline CSS:** Easiest for single-file deployment
- **External CSS:** More maintainable for complex styling
- **CSS Variables:** Good for consistent color theming
- **Three.js Styling:** May require renderer background changes

### **Browser Compatibility:**
- Modern browsers supporting ES6+ modules
- WebGL support for 3D visualization
- HTTPS-only due to HSTS configuration

## 📈 **Success Criteria**

### **Functional Requirements:**
- ✅ Professional homepage at https://featherweight.world/
- ✅ 3D visualization accessible at /visualization
- ✅ Metrics dashboard remains at /metrics
- ✅ All API endpoints functional
- ✅ SSL/HTTPS working across all pages

### **Design Requirements:**
- ✅ Consistent color scheme across all pages
- ✅ Professional typography implementation
- ✅ Brand-appropriate visual identity
- ✅ Mobile-responsive design
- ✅ High-quality presentation for investors

### **Performance Requirements:**
- ✅ Fast loading times (< 3 seconds)
- ✅ Smooth 3D visualization performance
- ✅ Real-time metrics updates (3-second intervals)
- ✅ Stable server operation

## 🚨 **Rollback Plan**

If issues arise during implementation:

```bash
# Restore original files
docker cp /tmp/spiral-3d-visualization-backup.html consciousness-web:/opt/app/public/index.html
docker cp /tmp/spiral-server-backup.js consciousness-web:/opt/app/server/simple-web-server.js
docker restart consciousness-web

# Verify rollback
curl -s https://featherweight.world/health
```

## 📞 **Support Information**

### **Key Files:**
- **Current Server:** `/opt/app/server/simple-web-server.js` (ES modules)
- **Current Visualization:** `/opt/app/public/index.html`
- **Nginx Config:** `/etc/nginx/sites-available/featherweight-main`
- **SSL Certs:** `/etc/letsencrypt/live/featherweight.world/`

### **Container Details:**
- **Name:** `consciousness-web`
- **Base Port:** 3000
- **Restart:** `docker restart consciousness-web`
- **Logs:** `docker logs consciousness-web`

### **Domain Setup:**
- **Domain:** featherweight.world
- **SSL:** Let's Encrypt (auto-renewal configured)
- **Nginx:** Active and properly configured
- **DNS:** Already properly pointed

## 🎯 **Immediate Next Steps**

1. **Coordinate with user** on color scheme and font preferences
2. **Create homepage mockup** for user approval
3. **Implement homepage** with navigation structure
4. **Update server routing** to handle new page structure
5. **Apply consistent UI styling** across all pages
6. **Test and validate** all functionality
7. **Deploy and monitor** the updated system

## 📝 **Notes for Next Agent**

- **User Priority:** Homepage creation and UI customization take precedence
- **Brand Consistency:** Maintain professional quality for investor presentations
- **Technical Stability:** Don't break existing 3D visualization or metrics functionality  
- **Performance:** Keep fast loading times and smooth interactions
- **User Feedback:** Coordinate on design choices before final implementation

---

**Status:** Ready for homepage development and UI customization
**Timeline:** Estimated 2-4 hours for complete implementation
**Risk Level:** Low (existing functionality preserved, additive changes)

---

*This handoff provides complete technical context and implementation guidance for the next agent to successfully create a homepage and customize the UI for featherweight.world.*
