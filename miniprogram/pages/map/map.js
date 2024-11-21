// pages/map/map.js
Page({
    data: {
        longitude: '',
        latitude: '',
        scale: 15,
        markers: []
    },
    onLoad(options) {
        console.log('=进入地图页面=', options.locations);
        let locations = JSON.parse(options.locations)
        let longitude = locations.longitude
        let latitude = locations.latitude
        this.setData({
            longitude,
            latitude
        })
    },

})