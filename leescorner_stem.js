(function (ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    // Block function
    ext.getWeatherData = function (sensor, location, callback) {

        var station = '';
        var sensorMap = {
            'Temperature': 'temp_f',
            'Humidity': 'humidity',
            'Rain Fall': 'rain_gauge',
            'Wind Direction': 'wind_direction',
            'Wind Speed': 'wind_speed'
        }

        switch (location) {
            case 'School':
                station = 'wunderground';
                break;
            case 'Classroom':
                station = 'weatherstation';
                break;
            default:
                station = 'wunderground';
        }

        // Make AJAX call to Wundergound weather API
        $.ajax({
            url: 'https://weather.kramertechsolutions.com/api/' + station + '/',
            dataType: 'json',
            success: function (data) {
                // Parse JSON for the temperature data

                callback(data[sensorMap[sensor]]);
            }
        });

    };

    // Block function
    ext.getRainFall = function (callback) {

        // Make AJAX call to Wundergound weather API
        $.ajax({
            url: 'https://weather.kramertechsolutions.com/api/weatherstation/rainfall/',
            dataType: 'json',
            success: function (data) {
                // Parse JSON for the temperature data

                callback(data['rain_fall']);
            }
        });

    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, name and function
            ['R', '%m.sensor for %m.location', 'getWeatherData', 'Temperature', 'School'],
            ['R', 'Rain fall for classroom', 'getRainFall']
        ],
        menus: {
            sensor: ['Temperature', 'Humidity', 'Rain Fall', 'Wind Direction', 'Wind Speed'],
            location: ['School', 'Classroom']
        }
    };

    // Register the extension
    ScratchExtensions.register('LeesCorner STEM', descriptor, ext);
})({});