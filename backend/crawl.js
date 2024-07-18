const { JSDOM } = require('jsdom')

async function crawl(baseUrl,curUrl,pagesFound){

    const baseUrlObj = new URL(baseUrl);
    const curUrlObj = new URL(curUrl);

    if(baseUrlObj.hostname !== curUrlObj.hostname){
        return pagesFound;
    }

    const normalizedUrl = normalizeURL(curUrl);

    if(pagesFound[normalizedUrl] > 0){
        pagesFound[normalizedUrl]++;
        return pagesFound;
    }
    pagesFound[normalizedUrl] = 1;


    try{
        const resp = await fetch(curUrl);

        if(resp.status > 399){
            console.log(`No pages found in the URL: ${curUrl} with Status Code: ${resp.status}`);
            return pagesFound;
        }

        const contentType = resp.headers.get("content-type");
        if(!contentType.includes("text/html")){
            console.log(`Non HTML response in ${curUrl}, Content Type: ${contentType}`);
            return pagesFound;
        }

        const htmlBody = await resp.text();

        const nextUrls = getUrlFromHTML(htmlBody,baseUrl)

        for(const nextUrl of nextUrls){
            pagesFound = await crawl(baseUrl,nextUrl,pagesFound);
        }


    }catch(err){
        console.log(`Error in fetching page: ${curUrl}`);
        return pagesFound;
    }

    return pagesFound; 
}

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


async function main(){
    const result = await crawl("https://wagslane.dev","https://wagslane.dev",{})
    console.log("\n\n================================================\n\n");
    for(page of Object.entries(result)){
        console.log(`Page: ${page[0]} Number of links to the page: ${page[1]}`);
    }
    console.log("\n\n================================================\n\n");

    return ;
}

main();


module.exports = {
    normalizeURL,
    getUrlFromHTML,
    crawl
};