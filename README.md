# 🌤️ YoWeather - Modern Weather Application

A beautiful, responsive weather application that provides real-time weather information, forecasts, and air quality data for any location worldwide.

![YoWeather](https://img.shields.io/badge/YoWeather-Weather%20App-purple)
![Live Demo](https://img.shields.io/badge/Live%20Demo-najar--yoweather.netlify.app-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Live Demo

**Visit the live application:** [najar-yoweather.netlify.app](https://najar-yoweather.netlify.app)

## ✨ Features

### 🌍 **Location Services**
- **Current Location**: Get weather data for your current location with one click
- **City Search**: Search for any city worldwide with autocomplete suggestions
- **Geolocation**: Automatic location detection with browser permissions

### 📊 **Weather Information**
- **Current Weather**: Real-time temperature, weather conditions, and feels-like temperature
- **5-Day Forecast**: Extended weather predictions with daily temperature ranges
- **Hourly Forecast**: 24-hour weather breakdown with temperature and wind speed
- **Weather Icons**: Dynamic weather icons that change based on conditions

### 🌡️ **Detailed Metrics**
- **Temperature**: Current, feels-like, and forecast temperatures
- **Humidity**: Current humidity percentage
- **Pressure**: Atmospheric pressure in hPa
- **Visibility**: Visibility range in kilometers
- **Wind Speed**: Current and forecasted wind speeds

### 🌅 **Sun Information**
- **Sunrise & Sunset**: Daily sunrise and sunset times
- **Day/Night Cycle**: Visual representation of daylight hours

### 🌬️ **Air Quality**
- **Air Quality Index**: Real-time air quality status (Good, Moderate, Poor, etc.)
- **Pollutant Data**: Detailed breakdown of:
  - PM2.5 (Particulate Matter)
  - SO2 (Sulfur Dioxide)
  - NO2 (Nitrogen Dioxide)
  - O3 (Ozone)

### 🎨 **User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark theme with purple accents
- **Smooth Animations**: Loading animations and smooth transitions
- **Search Suggestions**: Intelligent city search with autocomplete
- **Loading States**: Beautiful loading overlays during data fetching

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Weather API**: OpenWeatherMap API
- **Icons**: Google Material Symbols
- **Fonts**: Ubuntu, Chivo Mono (Google Fonts)
- **Deployment**: Netlify
- **Design**: Custom CSS with CSS Variables for theming

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Internet connection
- OpenWeatherMap API key (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yoweather.git
   cd yoweather
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local server for development

3. **For development with API key**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace the API key in `script.js` line 89

### Usage

1. **Search for a city**: Type in the search bar to find any city worldwide
2. **Use current location**: Click the "Current location" button for instant weather data
3. **View forecasts**: Scroll through 5-day and hourly forecasts
4. **Check air quality**: View detailed air quality information in the highlights section

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured layout with all information displayed
- **Tablet**: Adapted layout with optimized spacing
- **Mobile**: Touch-friendly interface with collapsible search

## 🔧 API Integration

The app integrates with multiple OpenWeatherMap APIs:
- **Geocoding API**: For city search and location data
- **Current Weather API**: For real-time weather data
- **5-Day Forecast API**: For extended weather predictions
- **Air Pollution API**: For air quality information

## 🎯 Key Features Explained

### Search Functionality
- Debounced search with 1-second delay
- Autocomplete suggestions with city, state, and country
- Abort controller for efficient API calls
- Error handling for failed requests

### Location Services
- Browser geolocation integration
- Permission handling with user feedback
- Fallback mechanisms for location errors

### Data Management
- Efficient API call management
- Real-time data updates
- Cached location data
- Error recovery mechanisms

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need support, please open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Light theme toggle
- [ ] Weather alerts and notifications
- [ ] Weather maps integration
- [ ] Historical weather data
- [ ] Weather widgets
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Weather comparison between cities

---

## 🚀 Built with ❤️ By Najar Anas 