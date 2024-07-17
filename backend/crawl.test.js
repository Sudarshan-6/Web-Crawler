const {normalizeURL,getUrlFromHTML} = require('./crawl.js')
const {test,expect} = require('@jest/globals')

test("Testing getUrlFromHTML",()=>{
    const input = `
    <html>
        <body>
            <a href = "/path1/">
            Blog
            </a>
            <a href = "https://blog.boot.dev/path2/">
            Blog
            </a>
        </body>
    <html>
    `;
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = getUrlFromHTML(input,inputBaseUrl);
    const output = ["https://blog.boot.dev/path1/","https://blog.boot.dev/path2/"];
    expect(actual).toEqual(output);

});

test("Testing normalizeURL",()=>{
    const input = "https://blog.boot.dev";
    const actual = normalizeURL(input);
    const output = "blog.boot.dev";
    expect(actual).toEqual(output);
});


test("Testing getUrlFromHTML invalid paths",()=>{
    const input = `
    <html>
        <body>
            <a href = "invalid">
            Blog
            </a>
            <a href = "https://blog.boot.dev/path2/">
            Blog
            </a>
        </body>
    <html>
    `;
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = getUrlFromHTML(input,inputBaseUrl);
    const output = ["https://blog.boot.dev/path2/"];
    expect(actual).toEqual(output);

});