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
    ext.get_temp = function (location, callback) {

        var station = '';

        switch(location) {
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
                var temperature = data['temp_f'];
                callback(temperature);
            }
        });


    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, name and function
            ['R', 'Temperature for %m.location', 'get_temp', 'School']
        ],
        menus: {
            location: ['School', 'Classroom']
        }
    };

    // Register the extension
    ScratchExtensions.register('LeesCorner STEM', descriptor, ext);
})({});