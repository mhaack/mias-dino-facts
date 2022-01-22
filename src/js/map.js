const map = new Datamap({
    element: document.getElementById('map'),
    projection: 'mercator',
    fills: {
        defaultFill: '#a4a9dd',
        dinoLocation: '#f8a900',
    },
    geographyConfig: {
        highlightFillColor: '#ad5857',
        highlightBorderWidth: 5,
        popupTemplate: function (geography, data) {
            const dino = map.options.data[geography.id];
            if (dino && !dino.name == '') {
                return (
                    '<div class="hoverinfo"><div class="hoverinfo__row">' +
                    '<div class="hoverinfo__column-1"><img src="/img/stegosaurus.png" alt="icon" height="32" width="32"></div>'+
                    '<div class="hoverinfo__column-2"><strong>' +
                    dino.name +
                    '</strong><br/>' +
                    geography.properties.name +
                    '</div></div></div>'
                );
            }
        },
    },
    data: {},
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            const dino = map.options.data[geography.id];
            if (dino && !dino.cardUrl == '') {
                window.open(dino.cardUrl, '_self');
            }
        });
    },
});

function dino(name, cardUrl, locations) {
    // disable all countries
    let countriesObj = {};
    for (const country in map.options.data) {
        countriesObj[country] = {
            fillKey: 'defaultFill',
            name: '',
            cardUrl: '',
        };
    }

    // enable dino location countries
    locations.split(',').forEach((country) => {
        countriesObj[country] = { fillKey: 'dinoLocation', name, cardUrl };
    });
    map.updateChoropleth(countriesObj);
}
