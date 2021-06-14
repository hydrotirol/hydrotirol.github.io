let basemapGr = L.tileLayer.provider('BasemapAT.grau');

const map = L.map("map", {
    fullscreenControl: true,
    center: [47.25, 11.5],
    zoom: 7.5,
    layers: [
        basemapGr
    ]
});

let layerControl = L.control.layers({
    "BasemapAT Grau": basemapGr,
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap Overlay+Ortho": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}).addTo(map);

let basemapGr = L.tileLayer.provider('BasemapAT.grau');

const map = L.map("map", {
    fullscreenControl: true,
    center: [47.25, 11.5],
    zoom: 7.5,
    layers: [
        basemapGr
    ]
});

let layerControl = L.control.layers({
    "BasemapAT Grau": basemapGr,
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap Overlay+Ortho": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}).addTo(map);