let basemapGr = L.tileLayer.provider('BasemapAT.grau');

//Karte mit raumplanerischen Daten
const fpmap = L.map("map", {
    fullscreenControl: true,
    center: [47.25, 11.5],
    zoom: 7.5,
    layers: [
        basemapGr
    ]
});

//Overlays 
let overlays = {
    Flussportraits: L.featureGroup()
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
    "Flussportraits": overlays.Flussportraits
}).addTo(fpmap);

//Overlays nach Laden anzeigen
overlays.Flussportraits.addTo(fpmap);

//Maßstab
L.control.scale({
    maxWidth: 200,
    metric: true,
    imperial: false
}).addTo(fpmap);

let drawportraits = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        style: (Feature) => {
            let col = COLORS.Flussportraits[Feature.properties.GEW_NAME];
            return {
                color: col
            }
        },
        onEachFeature: (Feature, layer) => {
            console.log(Feature.properties.GEW_NAME);
            /*layer.bindPopup(`<strong> Gewässer: </strong>${feature.properties.GEW_NAME}</strong><hr>
            <p>Abflussregime: ${feature.properties.Regime}</p>
            <p>Länge: ${feature.properties.lange} km </p>
            <p>mittlere Abflussspende Mq: ${feature.properties.mq} </p>
            <p>mittlerer Abfluss MQ: ${feature.properties.MQ_1}</p>
            <p>Kraftwerksbeeinflusst: ${feature.properties.kraftwerk}</p>
            `)*/
        },
        attribution: "Land Tirol"
    }).addTo(overlays.Flussportraits);
};

for (let config of OGDHYDRO) {
    console.log("Config: ", config.data);
    fetch(config.data)
        .then(response => response.json())
        .then(geoJsonData => {
            if (config.title == "Flussportraits") {
                drawportraits(geoJsonData);
            };
        })
}

//Minimap 
var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
    toggleDisplay: true,
    minimized: true
}).addTo(fpmap);