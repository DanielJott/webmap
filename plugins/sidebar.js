/////////////////////////////////////////////  SIDEBAR  /////////////////////////////////////////////////////////////////

// Sidebar mit Funktionen versehen

    var sidebar = document.getElementById('sidebar');
    sidebar.addEventListener('scroll', function() {
      var locationElements = document.querySelectorAll('#sidebar div[id^="location-"]');
      locationElements.forEach(function(element) {
        var bounding = element.getBoundingClientRect();
        if (bounding.top >= 0 && bounding.bottom <= window.innerHeight) {
          var index = parseInt(element.id.split('-')[1]);
        }
      });
    });

// Funktion zum Anzeigen aller Ortsbeschreibungen in der Sidebar
    function showAllLocations() {
      var sidebar = document.getElementById('sidebar');
      var content = '<h1>Venedig Story Map</h1>';

      zoo.forEach(function(location, index) {
        var anchorId = "location-" + index;
        content += '<div id="' + anchorId + '">' +
                   '<img src="' + location.Bild + '" alt="' + location.Name + '">' +
                   '<h2>' + location.Name + '</h2>' +
                   '<p>' + location.Beschreibung + '</p>' + '<br>' + 
           '<p>' + '<img src="media/symbols/uhr.png" style="width:24px;height:24px;">' + " " + location.Öffnungszeiten + '</p>' + '<br>' + 
           '<p>' + '<img src="media/symbols/preisschild.png" style="width:24px;height:24px;">' + " " + location.Preis + '</p>' +
                   '</div>';
      });

      sidebar.innerHTML = content;
    }

// Sidebar und Scrolling einfügen
    showAllLocations();