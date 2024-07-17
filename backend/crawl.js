const { JSDOM } = require('jsdom')


function getUrlFromHTML(htmlBody, baseUrl) {
    const urls = []
    const dom = new JSDOM(htmlBody);
    const links = dom.window.document.querySelectorAll('a');
    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {
            try {
                const url = new URL(`${baseUrl}${link.href}`);
                urls.push(url.href)
            } catch (err) {
                console.log(`Invalid URL: ${err}`)
            }
        } else {
            try {
                const url = new URL(link.href);
                urls.push(url.href)
            } catch (err) {
                console.log(`Invalid URL: ${err}`)
            }
        }
    }
    return urls;
}


function normalizeURL(baseUrl) {
    const url = new URL(baseUrl);
    const normalizedUrl = `${url.hostname}${url.pathname}`;
    if (normalizedUrl.slice(-1) === '/') {
        return normalizedUrl.slice(0, -1);
    }
    return normalizedUrl;
}

module.exports = {
    normalizeURL,
    getUrlFromHTML
};