const Image = require('@11ty/eleventy-img');
const util = require('util');
const path = require('path');

const emojiRegex =
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;

module.exports = (config) => {
    config.setUseGitIgnore(false);
    config.addWatchTarget('./src/_includes/css/main.css');

    config.addPassthroughCopy({ public: './' });
    config.addPassthroughCopy('src/img');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/js');
    config.addPassthroughCopy('admin');

    /* Collections */
    config.addCollection('dinos', (collection) => {
        return [...collection.getFilteredByGlob('./src/dinos/*.md')];
    });

    config.addCollection('tagList', (collection) => {
        const tagsSet = new Set();
        collection.getAll().forEach((item) => {
            if (!item.data.tags) return;
            item.data.tags.filter((tag) => !['dino'].includes(tag)).forEach((tag) => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort((first, second) => {
            const firstStartingLetter = first.replace(emojiRegex, '').trim()[0].toLowerCase();
            const secondStartingLetter = second.replace(emojiRegex, '').trim()[0].toLowerCase();

            if (firstStartingLetter < secondStartingLetter) {
                return -1;
            }
            if (firstStartingLetter > secondStartingLetter) {
                return 1;
            }
            return 0;
        });
    });

    /* Filters */
    config.addFilter('console', (value) => {
        return util.inspect(value);
    });

    config.addFilter('noEmoji', (value) => {
        if (!value) {
            return '';
        }
        return value.replace(emojiRegex, '').trim();
    });

    config.addFilter('onlyEmoji', (value) => {
        let match = value.match(emojiRegex);
        // If the string doesn't contain any emoji, instead we output the first letter wrapped in some custom styles
        if (!match) {
            match = `<span class="c-card__tag-first-letter">${value.charAt(0)}</span>`;
        }
        return Array.isArray(match) ? match.join('') : match;
    });

    config.addFilter('limit', (arr, limit) => arr.slice(0, limit));

    config.addFilter('lowercase', (value) => value.toLowerCase());

    config.addFilter('dateToIso', (dateString) => new Date(dateString).toISOString());

    config.addFilter('nameAscending', (arr) => arr.slice().sort((a, b) => a.data.title.localeCompare(b.data.title)));

    config.addFilter('withLocations', (arr) => arr.filter((item) => item.data.locations));

    /* Shortcodes */
    const imageShortcode = async (src, className, alt, sizes) => {
        const metadata = await Image(src.includes('http') ? src : `./src/${src}`, {
            widths: [null, 400, 800, 1280],
            formats: ['webp', 'jpeg'],
            outputDir: './_site/img/dinos',
            urlPath: '/img/dinos/',
            filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src);
                const name = path.basename(src, extension);
                return `${name}-${width}w.${format}`;
            },
        });

        let imageAttributes = {
            alt,
            sizes,
            loading: 'lazy',
            decoding: 'async',
        };
        if (className) {
            imageAttributes.class = className;
        }

        return Image.generateHTML(metadata, imageAttributes);
    };

    config.addNunjucksAsyncShortcode('image', imageShortcode);
    config.addShortcode('year', () => `${new Date().getFullYear()}`);

    return {
        dir: {
            input: 'src',
            output: '_site',
            includes: '_includes',
            data: '_data',
        },
        passthroughFileCopy: true,
    };
};
