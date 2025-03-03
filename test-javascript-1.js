'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
    return inputString[currentLine++];
}

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function getCountryName(code) {
    let page = 1;
    let totalPages = 1;
    const baseUrl = "https://jsonmock.hackerrank.com/api/countries?page=";

    while (page <= totalPages) {
        const data = await fetchData(baseUrl + page);
        
        totalPages = data.total_pages;

        for (let country of data.data) {
            if (country.alpha2Code === code) {
                return country.name;
            }
        }

        page++;
    }
    
    return null; // Jika tidak ditemukan (seharusnya tidak terjadi karena dijamin ada)
}

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);
    const code = readLine().trim();
    const name = await getCountryName(code);
    ws.write(`${name}\n`);
}
