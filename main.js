// GRUNDKARTE
// Karte initialisieren
var bounds = L.latLngBounds(
    L.latLng(52.0097, 8.5334),  // Südwest-Ecke
    L.latLng(52.0306, 8.4753)   // Nordost-Ecke
);

// Maximale Grenzen setzen und Startposition festlegen
var map = L.map('map', { 
    maxBounds: bounds,
    maxBoundsViscosity: 1.0 // Verhindert, dass die Karte über die festgelegten Grenzen hinaus verschoben werden kann
}).setView([52.01950, 8.50093], 16); // Startposition und Zoomstufe

// Kachel-Layer hinzufügen mit Watercolor Kartenstil und ohne Welttapete
L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
    noWrap: true, // Verhinderung Welttapete
    maxZoom: 17, // Maximale Zoomstufe
    minZoom: 16, // Minimale Zoomstufe
    attribution: '&copy; Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
}).addTo(map);

// GeoJSON-Daten für Straßen laden und mit einer grauen Farbe darstellen
L.geoJSON([straßen], {style: {color: 'grey'}}).addTo(map); // Die Funktion L.geoJSON lädt Koordinaten automatisch für leaflet ein (von lon, lat zu lat, lon)


// SIDEBAR
// Sidebar-Element abrufen und Überschrift "Anlagen" hinzufügen
var sidebar = document.getElementById('sidebar');
var title_sidebar = document.createElement('h2');
title_sidebar.textContent = 'Anlagen'; // Text für die Überschrift
title_sidebar.className = 'sidebar-title'; // CSS-Klasse setzen (In CSS: #=ID, .=Klasse)
sidebar.appendChild(title_sidebar); // Überschrift zur Sidebar hinzufügen

// Layer für Tierpark-Features erstellen und stilisieren
var tierparkLayer = L.geoJSON(tierparkGeoJSON, {
    style: function (feature) {
        // Standardstil für die Features
        let style = { fillColor: 'grey', color: 'black', opacity: 0.8, weight: 1 }; 

        // Stil basierend auf den Eigenschaften des Features ändern
        switch (feature.properties.Anlage) {
            case 'Tierparkgrenze':
                style = { fillColor: 'transparent', color: 'black', opacity: 0.8, weight: 2 };
                break;
            // Weitere Cases für andere Anlage-Werte
        }

        // Individuelle Stile für die unterschiedlichen Anlagen
        if (['Fischotter', 'Wölfe', 'Hühnervögel', 'Waschbären', 'Fledermäuse', 'Gamswild', 'Füchse', 'Vielfraß', 'Marder', 'Esel', 'Tarpane', 'Wisente', 'Störche', 'Greifvögel', 'Braunbären', 'Ponys und Hochlandrinder',
			 'Steinwild', 'Murmeltiere', 'Rotwild', 'Sikawild', 'Biber', 'Wildschweine', 'Damwild', 'Wildkatzen', 'Nutria'].includes(feature.properties.Anlage)) {
            style = { fillColor: 'yellow', color: 'black', opacity: 0.8, weight: 1 };
        }

        // Stil für Infrastruktur-Werte
        if (['Parkplatz', 'Spielplatz'].includes(feature.properties.Infrastruktur)) {
            style = { fillColor: 'rgba(06,81,163, 0.9)', color: 'black', opacity: 0.8, weight: 2 };
        }

        return style;
    },
    onEachFeature: function (feature, layer) {
        // Klick-Event für Features, um die entsprechende Sidebar-Element hervorzuheben
        layer.on('click', function () {
            map.fitBounds(layer.getBounds()); // Zoom auf das ausgewählte Feature
            highlightFeature(layer); // Feature hervorheben

            // Entsprechendes Sidebar-Element hervorheben
            var sidebarItem = document.getElementById(`sidebar-item-${tierparkGeoJSON.features.indexOf(feature)}`);
            document.querySelectorAll('.sidebar-item').forEach(function(item) {
                item.classList.remove('active'); // Alle anderen Sidebar-Elemente deaktivieren
            });
            sidebarItem.classList.add('active'); // Ausgewähltes Sidebar-Element aktivieren
            sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Animiertes scrollen zum Sidebar-Element
        });
    }
}).addTo(map);

// Funktion zum Hervorheben ausgewählter Features
function highlightFeature(layer) {
    tierparkLayer.resetStyle(); // Stil aller Features zurücksetzen

	// Stil des ausgewählten Features ändern
    layer.setStyle({
        color: 'green',  // Grüner Rand zur Hervorhebung
		fillColor: '#FF4500', // Füllfarbe setzen
        weight: 5 // Randstärke erhöhen
    });
}

// Sidebar mit den Eigenschaften der GeoJSON-Features befüllen
tierparkGeoJSON.features.forEach(function (feature, index) {
    var featureName = feature.properties.Anlage; // Name des Features basierend auf Eigenschaften
    var sidebarItem = document.createElement('div');
    sidebarItem.className = 'sidebar-item'; // CSS-Klasse setzen
    sidebarItem.textContent = featureName; // Textinhalt des Sidebar-Elements
    sidebarItem.id = `sidebar-item-${index}`; // ID benennen

    // Klick-Event auf das Sidebar-Element, um das entsprechende Feature auf der Karte hervorzuheben
    sidebarItem.addEventListener('click', function () {
        var layer = tierparkLayer.getLayers()[index];
        map.fitBounds(layer.getBounds()); // Zoom auf das ausgewählte Feature
        highlightFeature(layer); // Feature hervorheben

        // Das angeklickte Sidebar-Element hervorheben
        document.querySelecto-rAll('.sidebar-item').forEach(function(item) {
            item.classList.remove('active'); // Alle anderen Sidebar-Elemente deaktivieren
        });
        sidebarItem.classList.add('active'); // Ausgewähltes Sidebar-Element aktivieren
    });

    sidebar.appendChild(sidebarItem); // Sidebar-Element zur Sidebar hinzufügen
});


// PLUGIN BOUNCING MARKERS
// Funktion, zur Erstellung benutzerdefinierter Marker mit Bounce-Effekt
function createCustomMarker(map, lat, lng, iconUrl) {
    const icon = L.icon({
        iconUrl: iconUrl, // Pfad zum Symbol
        iconSize: [30, 30], // Größe des Symbols
        iconAnchor: [15, 30], // Ankerpunkt des Symbols
        popupAnchor: [0, -30], // Position des Popups relativ zum Symbol
    });

	// Marker erstellen und zu Karte hinzufügen
    const marker = L.marker([lat, lng], { icon: icon })
        .addTo(map)
        .on('mouseover', function() {
            this.bounce(2); // Marker zwei Mal springen lassen
        })
        .on('bounceend', function() {
            console.log('bounce end'); // Ausgabe in der Konsole nach dem Springen
        });

    return marker;
}

// Marker erstellen und unterschiedliche pngs einladen
createCustomMarker(map, 52.020743504543276, 8.500956871464382, 'logos/pacifier.png');
createCustomMarker(map, 52.0221101462962, 8.50041035707926, 'logos/transport.png');
createCustomMarker(map, 52.01812005860293, 8.500142980917047, 'logos/ladybug.png');
createCustomMarker(map, 52.01848863947242, 8.499694599737012, 'logos/binoculars2.png');
createCustomMarker(map, 52.02013132134135, 8.500887254691492, 'logos/cutlery.png');
createCustomMarker(map, 52.01986442008405, 8.50036151343295, 'logos/toilet1.png');


// PLUGIN SNAKE ROUTE
// Leere Variable für gezeichnete Linie
var drawnLine = null;

// Benutzerdefinierter Button für die Kinder-Route
var kinderLineButton = L.Control.extend({
    options: {
        position: 'topright' // Position des Buttons
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'kinder-route'); // Container für den Button
        var button = L.DomUtil.create('button', '', container); // Button-Element erstellen
        button.textContent = 'Kinder Route'; // Text des Buttons
        button.title = 'Zeichne die Route'; // Hover-Text

        // Klick-Event für den Button
        button.onclick = function () {
            if (drawnLine) {
                map.removeLayer(drawnLine); // Vorherige Linie entfernen, falls vorhanden
            }

            // Variable für die Route erstellen
            var latlngs = [];
            for (var i = 0, len = kinder_route.length; i < len; i++) {
                latlngs.push(new L.LatLng(kinder_route[i][0], kinder_route[i][1]));
            }

                // Durchgehende, fortschreitende Linie erstellen
                drawnLine = L.polyline(latlngs, {
                    snakingSpeed: 40, // Fortbewegungsgeschwindigkeit
                    color: '#FF6EC7', // Farbe der Linie
                    weight: 4 // Stärke der Linie
                });

                drawnLine.addTo(map).snakeIn();
            
            };
			
			return container;
        }    
});
// Kinder-Route-Button zur Karte hinzufügen
map.addControl(new kinderLineButton());


// Benutzerdefinierter Button für die Jugend-Route
var jugendLineButton = L.Control.extend({
    options: {
        position: 'topright' // Position des Buttons
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'jugend-route'); // Container für den Button
        var button = L.DomUtil.create('button', '', container); // Button-Element erstellen
        button.textContent = 'Jugend Route'; // Text des Buttons
        button.title = 'Zeichne die Route'; // Hover-Text
		
        // Handle click event on the button
        button.onclick = function () {
            if (drawnLine) {
                map.removeLayer(drawnLine); // Vorherige Linie entfernen, falls vorhanden
            }

            // Variable für die Route erstellen
            var latlngs = [];
            for (var i = 0, len = jugend_route.length; i < len; i++) {
                latlngs.push(new L.LatLng(jugend_route[i][0], jugend_route[i][1]));
            }

             // Durchgehende, fortschreitende Linie erstellen
            drawnLine = L.polyline(latlngs, {
                snakingSpeed: 80, // Fortbewegungsgeschwindigkeit
                color: '#0FF', // Farbe der Linie
                weight: 4 // Stärke der Linie
            });
            drawnLine.addTo(map).snakeIn();
        };
        return container;
    }
});
// Jugend-Route-Button zur Karte hinzufügen
map.addControl(new jugendLineButton());


// PLUGIN LEGENDE
// Legenden-Kontrollobjekt erstellen
const legend = L.control.Legend({ 
    position: "topleft", // Position der Legende auf der Karte (oben links)
    collapsed: true, // Legende standardmäßig eingeklappt
    symbolWidth: 28, // Breite der Symbole in der Legende
    opacity: 0.6, // Transparenz der Legende
    column: 2, // Anzahl der Spalten in der Legende
    
	// Definition der Einträge in der Legende
    legends: [{
        label: "Schnullerbaum", // Beschriftung für den Schnullerbaum
        type: "image", // Art des Symbols (Bild)
        url: "logos/pacifier.png", // Pfad zum Symbolbild
    }, {
        label: "Bushaltestelle",
        type: "image",
        url: "logos/transport.png"
    }, {
        label: "Insektenhotel",
        type: "image",
        url: "logos/ladybug.png"
    }, {
        label: "Aussichtspunkt",
        type: "image",
        url: "logos/binoculars2.png"
    }, {
        label: "Restaurant",
        type: "image",
        url: "logos/cutlery.png"
    }, {
        label: "Toilette",
        type: "image",
        url: "logos/toilet1.png"
    }]
})
// Legende zur Karte hinzufügen
.addTo(map);
		

// SLIDER PLUGIN
// Erstellen der Variablen für benutzerdefinierten Icons

var icon1 = L.icon({
    iconUrl: 'logos/wolf.png', // URL des Icons für Wolf
    iconSize: [32, 32], // Größe des Icons
    iconAnchor: [16, 32], // Ankerpunkt des Icons (entspricht der Markerposition)
    popupAnchor: [0, -32] // Punkt, von dem aus das Popup relativ zum Icon-Anker geöffnet wird
});

var icon2 = L.icon({
    iconUrl: 'logos/sea.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

var icon3 = L.icon({
    iconUrl: 'logos/bobcat.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

var icon4 = L.icon({
    iconUrl: 'logos/bear.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Erstellen der Marker
var marcador1 = L.marker([52.020324894381446, 8.503987915276213], { // Markerposition
    icon: icon1, // Verwendetes Icon
    time: '2014-06-14 10:00:00'  // Zeitstempel für den Marker
}).addTo(map); // Marker zur Karte hinzufügen


var marcador2 = L.marker([52.018787892374434, 8.49985701558299], {
    icon: icon2,
    time: '2015-01-06 11:00:00'
}).addTo(map);

var marcador3 = L.marker([52.018593071908555, 8.500935371543079], {
    icon: icon3,
    time: '2015-01-06 11:30:00'
}).addTo(map);

var marcador4 = L.marker([52.01811800090218, 8.498877419759339], {
    icon: icon4,
    time: '2015-01-06 15:00:00'
}).addTo(map);

// Gruppieren der Marker in einer Layer-Gruppe
const marcadores = [marcador1, marcador2, marcador3, marcador4]; // Array mit allen Markern
layerGroup = L.layerGroup(marcadores); // Layer-Gruppe mit den Markern erstellen
layerGroup.addTo(map); // Layer-Gruppe zur Karte hinzufügen

// Hinzufügen des Slider-Controls
var sliderControl = L.control.sliderControl({
    layer: layerGroup, // Layer-Gruppe für den Slider
    position: "bottomleft", // Position des Sliders auf der Karte
    range: true, // Slider als Bereich einstellen (Start-End-Zeiten)
    showAllOnStart: false, // Alle Marker nicht beim Start anzeigen
    alwaysShowDate: true, // Datum immer anzeigen
    startTimeIdx: 12, // Startindex für die Zeit
    showAllPopups: false, // Alle Popups nicht auf einmal anzeigen
    showPopups: false, // Popups nicht beim Verschieben des Sliders anzeigen
    timeStrLength: 0, // Länge der Zeitzeichenfolge    
    onlyDateString: false // Nur das Datum als Zeichenfolge anzeigen
});
map.addControl(sliderControl); // Slider-Control zur Karte hinzufügen
sliderControl.startSlider(); // Slider starten


// Textfeldüberschrift für den Slider
var feedingTimesControl = L.Control.extend({ // Erstellen eines Elements, welches von L.Control abgeleitet wird
    options: {
        position: 'bottomleft' // Position des Elements (unten links)
    },
    onAdd: function (map) { // Funktion, die ausgeführt wird, wenn das Element zur Karte hinzugefügt wird
        var container = L.DomUtil.create('div', 'leaflet-control-feeding-times'); // Erstellen eines Containers für das Element

        // Textfeld zum Container hinzufügen
        var textField = L.DomUtil.create('div', '', container); // Erstellen eines Textfelds im Container
        textField.textContent = 'Fütterungszeiten:'; // Text, der im Textfeld angezeigt wird

        // Textfeld stilisieren (optional)
        container.style.backgroundColor = 'pink'; // Hintergrundfarbe des Containers auf pink setzen
        container.style.padding = '6px'; // Innenabstand (Padding) des Containers auf 6px setzen
        container.style.fontSize = '14px'; // Schriftgröße auf 14px setzen
        container.style.fontFamily = 'Arial, sans-serif'; // Schriftart auf Arial setzen
        container.style.fontWeight = 'bold'; // Schrift auf fett (bold)
        container.style.borderRadius = '5px'; // Ecken des Containers abrunden (5px Radius)

        return container;
	}
});

// Element zur Karte hinzufügen
map.addControl(new feedingTimesControl()); 

// Home-Button
var homeButton = L.Control.extend({ // Erstellen eines Steuerelements mit L.Control
    options: {
        position: 'topright' // Position des Elements
    },
    onAdd: function (map) { // Funktion, die ausgeführt wird
        var container = L.DomUtil.create('div', 'leaflet-control-home'); // Erstellen eines Containers
        var img = L.DomUtil.create('img', '', container); // Hinzufügen eines Bildes (img-Tag) zum Container
        img.src = 'logos/house.png'; // Dateipfad zum logo
        img.title = 'Zurücksetzen'; // Hover-Text

        // Klick-Event
        container.onclick = function () { // Definieren der Aktion, die beim Klicken auf die Kontrolle ausgeführt wird
            map.setView([52.01950, 8.50093], 16); // Zurücksetzen der Kartenansicht auf die Anfangsposition und Zoomstufe
            tierparkLayer.resetStyle(); // Zurücksetzen aller Polygonstile (Anpassung von Layern)

            // Entfernen der aktiven Klasse von allen Sidebar-Elementen
            document.querySelectorAll('.sidebar-item').forEach(function(item) {
                item.classList.remove('active');
            });

            // Entfernen der gezeichneten Linie von der Karte
            if (drawnLine) { // Überprüfen, ob eine Linie gezeichnet wurde
                map.removeLayer(drawnLine); // Entfernen der Linie von der Karte
                drawnLine = null; // Zurücksetzen der Linie auf null
            }
        };

        return container;
    }
});
map.addControl(new homeButton());