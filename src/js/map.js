const createLinkedEntry = (name, url) => {
    const entry = document.createElement('li');
    const entryLink = document.createElement('a');
    entryLink.href = url;
    entryLink.textContent = name;
    entry.append(entryLink);
    return entry;
};

const countrySelected = (geography, country) => {
    const label = document.querySelector('div#picker span');
    const wrapper = document.querySelector('div#picker ul');
    if (country) {
        label.textContent = `In ${geography.properties.name} gefunden:`;

        if (wrapper) {
            wrapper.innerHTML = '';
            country.info?.forEach((dino) => {
                wrapper.append(createLinkedEntry(dino.name, dino.url));
            });
        }
    } else {
        label.textContent = '';
        wrapper.innerHTML = '';
    }
};

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
            return (
                data &&
                data.info &&
                "<div class='hoverinfo'><strong>" + data.info.map((e) => e.name).join('<br>') + '</strong></div>'
            );
        },
    },
    dataUrl: '/map.json',
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            const country = map.options.data[geography.id];
            countrySelected(geography, country);
        });
    },
});
