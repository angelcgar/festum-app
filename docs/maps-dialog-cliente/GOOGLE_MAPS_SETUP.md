# 🗺️ Google Maps Integration - Setup Guide

This document explains how to configure and use the Google Maps integration for capturing client addresses in the Festum App.

## 📋 Prerequisites

1. A Google Cloud Platform account
2. A Google Maps API Key with the following APIs enabled:
   - Maps JavaScript API
   - Geocoding API

## 🔑 Getting Your Google Maps API Key

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**

### Step 2: Enable Required APIs

Enable the following APIs:
- **Maps JavaScript API** - For displaying the map
- **Geocoding API** - For reverse geocoding (converting coordinates to addresses)

### Step 3: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Recommended) Click **Restrict Key** and:
   - Set application restrictions (HTTP referrers for web)
   - Set API restrictions to only the APIs you need

## ⚙️ Configuration

### Update index.html

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/index.html` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places" async defer></script>
```

**Example:**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX&libraries=places" async defer></script>
```

### Security Best Practices

For production, consider:
1. Using environment variables to store the API key
2. Setting up API key restrictions in Google Cloud Console
3. Implementing backend proxy for API calls
4. Monitoring API usage and setting quotas

## 🎯 How to Use the Feature

### For End Users

1. **Open Cliente Dialog**
   - Click "Nuevo Cliente" or edit an existing client

2. **Navigate to Address Section**
   - Scroll to the "Dirección del Cliente" section
   - Look for the blue map button (🗺️) next to the section title

3. **Open Maps Dialog**
   - Click the map button to open the Google Maps interface

4. **Place a Pin**
   - Click anywhere on the map to place a pin
   - The pin can be dragged to adjust the location
   - Click again to move the pin to a new location

5. **Capture Address**
   - Once the pin is placed, the "Capturar dirección" button becomes enabled
   - Click it to capture the address
   - The dialog will close and populate all address fields automatically

6. **Review and Save**
   - Review the captured address information
   - Make any manual adjustments if needed
   - Save the client

### Address Structure

The captured address includes:
- **fullAddress**: Complete formatted address
- **street**: Street name
- **number**: Street number
- **neighborhood**: Neighborhood/Colony
- **city**: City name
- **state**: State/Province
- **country**: Country name
- **postalCode**: Postal/ZIP code
- **lat**: Latitude coordinate
- **lng**: Longitude coordinate

## 🔧 Technical Details

### Components Created

1. **maps-client-dialog.component.ts**
   - Handles Google Maps initialization
   - Manages pin placement and dragging
   - Performs reverse geocoding
   - Returns structured address data

2. **maps-client-dialog.component.html**
   - Map container
   - Action buttons (Capturar dirección, Cancelar)
   - User instructions

3. **maps-client-dialog.component.scss**
   - Responsive styling
   - Material Design integration

### Integration Points

- **cliente-dialog.component.ts**: Opens the maps dialog and receives captured address
- **cliente-dialog.component.html**: Map button in address section
- **index.html**: Google Maps API script loading

## 🐛 Troubleshooting

### Map Not Loading

**Issue**: Map container shows gray background
**Solutions**:
1. Check that your API key is valid
2. Verify Maps JavaScript API is enabled in Google Cloud Console
3. Check browser console for specific error messages
4. Ensure the script is loaded before the component initializes

### Geocoding Errors

**Issue**: "Capturar dirección" doesn't work
**Solutions**:
1. Verify Geocoding API is enabled
2. Check API key has permission for Geocoding API
3. Ensure you're not exceeding API quotas
4. Check network tab for API call errors

### TypeScript Errors

**Issue**: `Cannot find namespace 'google'`
**Solutions**:
1. Ensure `@types/google.maps` is installed: `pnpm add -D @types/google.maps`
2. Verify `tsconfig.app.json` includes `"google.maps"` in types array
3. Restart your IDE/TypeScript server

### API Key Restrictions

**Issue**: API key works locally but not in production
**Solutions**:
1. Add your production domain to HTTP referrer restrictions
2. Ensure API key restrictions allow your deployment domain
3. Check that all required APIs are enabled

## 💰 Pricing Considerations

Google Maps Platform has a pay-as-you-go pricing model:

- **Maps JavaScript API**: $7 per 1,000 loads
- **Geocoding API**: $5 per 1,000 requests

**Free Tier**: $200 monthly credit (approximately 28,500 map loads or 40,000 geocoding requests)

### Cost Optimization Tips

1. Implement caching for frequently accessed locations
2. Use API key restrictions to prevent unauthorized use
3. Monitor usage in Google Cloud Console
4. Consider implementing rate limiting
5. Store geocoded addresses to avoid repeated API calls

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

## 🔄 Future Enhancements

Potential improvements to consider:

1. **Search Functionality**: Add address search/autocomplete
2. **Current Location**: Use geolocation to center map on user's location
3. **Multiple Pins**: Support for multiple addresses per client
4. **Custom Markers**: Different pin styles for different client types
5. **Offline Support**: Cache map tiles for offline use
6. **Route Planning**: Integration with delivery/event planning features
