class MapData {
    data() {
        return {
            eleventyExcludeFromCollections: true,
            permalink: 'map.json',
        };
    }

    render(data) {
        const mappendDinoData = new Map();
        data.collections.dinos.forEach((dino) => {
            if (dino.data.locations) {
                dino.data.locations.forEach((loc) => {
                    if (!mappendDinoData.has(loc)) {
                        mappendDinoData.set(loc, []);
                    }
                    mappendDinoData.get(loc).push({ name: dino.data.title, url: dino.url });
                });
            }
        });

        const mapData = {};
        mappendDinoData.forEach((value, key) => {
            mapData[key] = { fillKey: 'dinoLocation', info: value };
        });
        return JSON.stringify(mapData);
    }
}
module.exports = MapData;
