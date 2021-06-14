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
        Wasserstände: L.featureGroup()
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
        "Wasserstände": overlays.Wasserstände
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

    //Overlays nach Laden anzeigen
    overlays.Wasserstände.addTo(hydromap);

    // Attribution
    hydromap.attributionControl.addAttribution("<a href='https://wiski.tirol.gv.at/hydro/ogd/OGD_W.csv'>Land Tirol</a>")


    /*CSV mit Papa Parse
    Papa.parse("https://wiski.tirol.gv.at/hydro/ogd/OGD_W.csv", {
        download: true,
        complete: function(results) {
            //console.log(results)
                console.log("Station: ",
                station);
                let stationdraw =
                [results.data[96],
                results.data[192], results.data[288],
                results.data[384], results.data[480],
                results.data[576], results.data[672],
                results.data[768], results.data[864],
                results.data[960], results.data[1065],
                results.data[1152], results.data[1248],
                results.data[1344], results.data[1440],
                results.data[1536], results.data[1632],
                results.data[1728], results.data[1824],
                results.data[1920], results.data[2016],
                results.data[2112], results.data[2208],
                results.data[2304], results.data[2400],
                results.data[2496], results.data[2592],
                results.data[2688], results.data[2784],
                results.data[2880], results.data[2976],
                results.data[3072], results.data[3168],
                results.data[3264], results.data[3360],
                results.data[3456], results.data[3552],
                results.data[3648], results.data[3744],
                results.data[3840], results.data[3936],
                results.data[4032], results.data[4128],
                results.data[4224], results.data[4320],
                results.data[4416], results.data[4512],
                results.data[4608], results.data[4896],
                results.data[4992],
                results.data[5088],
                results.data[5184],
                results.data[5280],
                results.data[5376],
                results.data[5472],
                results.data[5568],
                results.data[5664],
                results.data[5760],
                results.data[6048],
                results.data[6144],
                results.data[6240],
                results.data[6336],
                results.data[6432],
                results.data[6528],
                results.data[6624],
                results.data[6720],
                results.data[6816],
                results.data[6912],
                results.data[7008],
                results.data[7104],
                results.data[7200],
                results.data[7296],
                results.data[7392],
                results.data[7488],
                results.data[7584]
            ]
            console.log(stationdraw);*/


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
            let Info3 = '<p><strong>Zeitstempel: </strong>' + formattedDate.toLocaleString('de') + ' Uhr' + '</p>';
            let Info1 = '<p><strong>Stationsnummer: </strong>' + NeustesArray[i][1] + '</p>';
            Info = Info.concat(Info2, Info4, Info3, Info1);
            L.marker(Cords[i]).addTo(overlays.Wasserstände).bindPopup(Info);

        }

    }


}