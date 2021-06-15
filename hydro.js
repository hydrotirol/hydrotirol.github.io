window.onload = function () {
    let basemapGr = L.tileLayer.provider('BasemapAT.grau');

    //Karte mit hydrologischen Daten
    const hydromap = L.map("map", {
        fullscreenControl: true,
        center: [47.25, 11.5],
        zoom: 7.5,
        layers: [
            basemapGr
        ],
    });

    //Overlays
    let overlays = {
        Wasserstände: L.featureGroup(),
        Wetterdaten: L.featureGroup()

    }

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
        "Wasserstände": overlays.Wasserstände,
        "Wetterdaten": overlays.Wetterdaten
    }).addTo(hydromap);

    L.control.scale({
        maxWidth: 200,
        metric: true,
        imperial: false
    }).addTo(hydromap);

    //Minimap 
    var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
        toggleDisplay: true,
        minimized: true
    }).addTo(hydromap);

    //nur Wasserstandsdaten nach Laden anzeigen
    overlays.Wasserstände.addTo(hydromap);

    // Attribution
    hydromap.attributionControl.addAttribution("<a href='https://wiski.tirol.gv.at/hydro/ogd/OGD_W.csv'>Land Tirol</a>")

    //Rainviewer
    L.control.rainviewer({
        position: 'bottomright',
        nextButtonText: '>',
        playStopButtonText: 'Play/Stop',
        prevButtonText: '<',
        positionSliderLabelText: "Hour:",
        opacitySliderLabelText: "Opacity:",
        animationInterval: 500,
        opacity: 0.75
    }).addTo(hydromap);

    // Temperatur + Schneehöhe
    let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

    fetch(awsUrl).then(response => response.json())
        .then(json => {
            for (station of json.features) {
                let marker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ]);
                let formattedDate = new Date(station.properties.date);
                marker.bindPopup(`
    <strong>${station.properties.name}</strong><hr>
        <strong>Temperatur: </strong> ${station.properties.LT||"-"} °C <br>
        <strong>Schneehöhe: </strong> ${station.properties.HS||"-"} cm <br>
        <strong>Datum: </strong>${formattedDate.toLocaleString("de")} Uhr <br>
        <strong>Seehöhe: </strong> ${station.geometry.coordinates[2] ||"-"} m.ü.A.


    <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
    `).addTo(overlays.Wetterdaten);
            }
        })

    // Wasserstandsdaten

    const config = {
        delimiter: ";", // auto-detect
        newline: "", // auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "UTF-8",
        worker: false,
        comments: false,
        step: undefined,
        complete: undefined,
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        downloadRequestBody: undefined,
        skipEmptyLines: false,
        chunk: undefined,
        chunkSize: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    };


    var StandortFile = 'data/stationenWGS.csv';
    var Cords = [];

    async function getStandort() {
        let response = await fetch(StandortFile)
        let csv = await response.text()
        var data = Papa.parse(csv, config);
        data = data.data;
        data.shift();
        data.pop();

        data.forEach(element => Cords.push([element[0], element[1]]));
        console.log(Cords);


    }


    // console.log(data);

    getStandort();
    // console.log(Cords);

    var Url = "https://wiski.tirol.gv.at/hydro/ogd/OGD_W.csv";

    function getFromAPI(url, callback) {

        var obj;
        fetch(url)
            .then(res => res.text())
            .then(data => obj = data)
            .then(() => callback(obj))
        //console.log(obj);
    }

    getFromAPI(Url, getData);
    let Standortwerte = [];

    function Zeit(Zeitpunkt) {
        let time = new Date(Zeitpunkt);
        time = time.toLocaleString('de');
        return time;
    }

    function getData(arrOfObjs) {

        const data = Papa.parse(arrOfObjs, config);
        console.log(arrOfObjs);
        let Anzeige = data.data;
        Anzeige.shift();
        Anzeige.pop();
        var LastTreffer = Anzeige.slice(-1).pop()
        var SuchZeit = LastTreffer[4];

        console.log(arrOfObjs);

        var NeustesArray = Anzeige.filter(function (el) {
            return el[4] === SuchZeit;

        });

        NeustesArray.forEach(element => Standortwerte.push([element[0], element[2], Zeit(element[4]), element[5], element[6], element[7] + ' m.ü.A.']));

        let punkte = Standortwerte.length;

        for (i = 0; i < punkte; i++) {

            let formattedDate = new Date(NeustesArray[i][4]);

            let Info = '<p><strong>Stationsname: </strong>' + NeustesArray[i][0] + '</p>';
            let Info2 = '<p><strong>Gewässer: </strong>' + NeustesArray[i][2] + '</p>';
            let Info4 = '<p><strong>Wasserstand W: </strong>' + NeustesArray[i][5] + ' ' + NeustesArray[i][6] + '</p>' + "<hr>";
            let Info5 = '<p><strong>Seehöhe: </strong>' + NeustesArray[i][7] + ' m.ü.A.' + '</p>';
            let Info3 = '<p><strong>Datum: </strong>' + formattedDate.toLocaleString('de') + ' Uhr' + '</p>';
            let Info1 = '<p><strong>Stationsnummer: </strong>' + NeustesArray[i][1] + '</p>';
            Info = Info.concat(Info2, Info4, Info5, Info3, Info1);
            L.marker(Cords[i]).addTo(overlays.Wasserstände).bindPopup(Info);

        }

    }


}