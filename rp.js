let basemapGr = L.tileLayer.provider('BasemapAT.grau');

//Karte mit raumplanerischen Daten
const rpmap = L.map("map", {
    fullscreenControl: true,
    center: [47.25, 11.5],
    zoom: 7.5,
    layers: [
        basemapGr
    ]
});

//Overlays 
let overlays = {
    Überflutungsflächen: L.featureGroup()
};

let layerControl = L.control.layers({
    "BasemapAT Grau": basemapGr,
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap Overlay+Ortho": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Überflutungsflächen": overlays.Überflutungsflächen
}).addTo(rpmap);

//Overlays nach Laden anzeigen
overlays.Überflutungsflächen.addTo(rpmap);

//Maßstab
L.control.scale({
    maxWidth: 200,
    metric: true,
    imperial: false
}).addTo(rpmap);

let drawUeberflutung = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        style: (feature) => {
            let col = COLORS.Überflutung[feature.properties.OBJEKTBEZE];
            return {
                color: col
            }
        },
        onEachFeature: (feature, layer) => {
            console.log(feature.properties.OBJEKTBEZE);
            layer.bindPopup(`<strong>${feature.properties.OBJEKTBEZE}</strong>`)
        },
        attribution: "<a href='https://data-tiris.opendata.arcgis.com/datasets/ueberflutungsflaechen'>Land Tirol</a>"
    }).addTo(overlays.Überflutungsflächen);
};

for (let config of OGDHYDRO) {
    console.log("Config:", config.data);
    fetch(config.data)
        .then(response => response.json())
        .then(geoJsonData => {
            if (config.title == "Überflutungsflächen") {
                drawUeberflutung(geoJsonData);
            };
        })
}

//minimap
var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
    toggleDisplay: true,
    minimized: true
}).addTo(rpmap);