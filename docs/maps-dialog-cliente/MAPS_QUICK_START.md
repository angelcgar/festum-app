# 🗺️ Maps Feature - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable **Maps JavaScript API** and **Geocoding API**
4. Create an API key under **Credentials**

### Step 2: Configure API Key
Open `src/index.html` and replace:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" async defer></script>
```

With your actual key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxx&libraries=places" async defer></script>
```

### Step 3: Run the App
```bash
pnpm start
# or
ng serve
```

### Step 4: Test the Feature
1. Navigate to **Clientes** module
2. Click **Nuevo Cliente**
3. In the **Dirección del Cliente** section, click the blue map button (🗺️)
4. Click on the map to place a pin
5. Click **Capturar dirección**
6. Verify all address fields are populated
7. Save the client

## 🎯 Usage

### Opening the Maps Dialog
- Location: Cliente Dialog → "Dirección del Cliente" section
- Button: Blue circular button with map icon (top-right of section)
- Tooltip: "Capturar dirección desde mapa"

### Placing a Pin
- **First click**: Places a pin at that location
- **Subsequent clicks**: Removes old pin and places new one
- **Dragging**: Pin can be dragged to adjust position

### Capturing Address
- Button enabled only when pin is placed
- Click **"Capturar dirección"** to geocode
- Address automatically populates all form fields
- Dialog closes automatically after capture

### Canceling
- Click **"Cancelar"** or close button (X)
- No changes made to form
- Dialog closes without capturing

## 📋 Captured Data

The feature captures:
- ✅ Full formatted address
- ✅ Street name and number
- ✅ Neighborhood/Colony
- ✅ City and State
- ✅ Country and Postal Code
- ✅ GPS Coordinates (lat/lng)

## 🐛 Common Issues

### Map shows gray background
**Solution**: Check API key is valid and Maps JavaScript API is enabled

### "Capturar dirección" doesn't work
**Solution**: Enable Geocoding API in Google Cloud Console

### TypeScript errors
**Solution**: Already fixed! `@types/google.maps` is installed and configured

### API key works locally but not in production
**Solution**: Add production domain to API key restrictions in Google Cloud Console

## 💡 Tips

1. **Default Location**: Map centers on Guadalajara, México (can be customized)
2. **Zoom Level**: Set to neighborhood level for easy navigation
3. **Pin Dragging**: Users can fine-tune location by dragging the pin
4. **Console Logs**: Check browser console to see captured address data
5. **Form Override**: Captured data overwrites existing form values

## 📊 API Usage

- **Map Load**: 1 request per dialog open
- **Geocoding**: 1 request per "Capturar dirección" click
- **Free Tier**: $200/month credit (~28,500 map loads or 40,000 geocodes)

## 🔗 Resources

- Full Setup Guide: `docs/GOOGLE_MAPS_SETUP.md`
- Implementation Details: `docs/MAPS_FEATURE_IMPLEMENTATION.md`
- [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)

---

**Ready to use!** 🚀 Just add your API key and start capturing addresses from maps.
