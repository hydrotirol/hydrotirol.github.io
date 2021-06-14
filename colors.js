const COLORS = {
    Überflutung: {
        "Gefahrenbereich bis HQ300": "#0074D9",
        "Rote Gefahrenzone": "#FF4136",
        "Gelbe Gefahrenzone": "#FFDC00",
        "Blauer Funktionsbereich": "#00008B",
        "Rote Gefahrenzone - rot gelber Funktionsbereich": "#FF8800",
    },
    Hydrodaten: {
        "Wasserstand": "#000088"
    },
    Flussportraits: {
        "Inn": "#00688B",
        "Lech": "#7A8B8B",
        "Isel": "#00868B",
        "Ötztaler Ache": "#2F4F4F",
        "Ziller": "#006400"
    },
    Temperatur: [{
        min: -100,
        max: -25,
        col: "#9f80ff"
    }, {
        min: -25,
        max: -20,
        col: "#784cff"
    }, {
        min: -20,
        max: -15,
        col: "#0f5abe"
    }, {
        min: -15,
        max: -10,
        col: "#1380ff"
    }, {
        min: -10,
        max: -5,
        col: "#19cdff"
    }, {
        min: -5,
        max: 0,
        col: "#8fffff"
    }, {
        min: 0,
        max: 5,
        col: "#b0ffbc"
    }, {
        min: 5,
        max: 10,
        col: "#ffff73"
    }, {
        min: 10,
        max: 15,
        col: "#ffbe7d"
    }, {
        min: 15,
        max: 20,
        col: "#ff9b41"
    }, {
        min: 20,
        max: 25,
        col: "#ff5a41"
    }, {
        min: 25,
        max: 30,
        col: "#ff1e23"
    }, {
        min: 30,
        max: 999,
        col: "#fa3c96"
    }],
    Schneehöhe: [{
        min: 0,
        max: 1,
        col: "#fff"
    }, {
        min: 1,
        max: 10,
        col: "#ffffb2"
    }, {
        min: 10,
        max: 25,
        col: "#b0ffbc"
    }, {
        min: 25,
        max: 50,
        col: "#8cffff"
    }, {
        min: 50,
        max: 100,
        col: "#19cdff"

    }, {
        min: 100,
        max: 200,
        col: "#1982ff"
    }, {
        min: 200,
        max: 300,
        col: "#0f5abe"
    }, {
        min: 300,
        max: 400,
        col: "#784bff"
    }, {
        min: 400,
        max: 10000,
        col: "#cd0feb"
    }]
};