import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const crawl = async (baseUrl, curUrl, pagesFound) => {
  const baseUrlObj = new URL(baseUrl);
  const curUrlObj = new URL(curUrl);

  if (baseUrlObj.hostname !== curUrlObj.hostname) {
    return pagesFound;
  }

  const normalizedUrl = normalizeURL(curUrl);

  if (pagesFound[normalizedUrl] > 0) {
    pagesFound[normalizedUrl]++;
    return pagesFound;
  }
  pagesFound[normalizedUrl] = 1;

  try {
    const resp = await fetch(curUrl);

    if (resp.status > 399) {
      console.log(`No pages found in the URL: ${curUrl} with Status Code: ${resp.status}`);
      return pagesFound;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Non HTML response in ${curUrl}, Content Type: ${contentType}`);
      return pagesFound;
    }

    const htmlBody = await resp.text();
    const nextUrls = getUrlFromHTML(htmlBody, baseUrl);

    for (const nextUrl of nextUrls) {
      pagesFound = await crawl(baseUrl, nextUrl, pagesFound);
    }
  } catch (err) {
    console.log(`Error in fetching page: ${curUrl}`);
    return pagesFound;
  }

  return pagesFound;
};

const getUrlFromHTML = (htmlBody, baseUrl) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      try {
        const url = new URL(`${baseUrl}${href}`);
        urls.push(url.href);
      } catch (err) {
        console.log(`Invalid URL: ${err}`);
      }
    } else if (href) {
      try {
        const url = new URL(href);
        urls.push(url.href);
      } catch (err) {
        console.log(`Invalid URL: ${err}`);
      }
    }
  });
  return urls;
};

const normalizeURL = (baseUrl) => {
  const url = new URL(baseUrl);
  const normalizedUrl = `${url.hostname}${url.pathname}`;
  return normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
};

export default async (req, res) => {
  const { baseUrl, curUrl } = req.query;
  const result = await crawl(baseUrl, curUrl, {});
  res.status(200).json(result);
};
