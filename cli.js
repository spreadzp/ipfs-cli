#!/usr/bin/env node

const { spawn } = require("child_process");
//const { create } = require('ipfs-http-client');
// const ipfs = require('ipfs-http-client'); 
const [, , ...args] = process.argv
const { removeFile } = require("./remove-file")
console.log(`Command ${args}`);

const { writeConfig } = require("./manage-config");
const { unzipFile } = require("./unzip");
// const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

if (args[0] === "upload") {

    const ls = spawn("zip", ["-r", "node_modules", "node_modules"]);
    ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    ls.on("close", async code => {
        console.log(`zip process exited with code ${code}`);
        if (code === 0) {
            const uploadToIpfs = spawn("curl", ["-F", "file=@node_modules.zip", "https://ipfs.infura.io:5001/api/v0/add"]);

            let cidInfo = "";
            uploadToIpfs.stdout.on("data", data => {
                if (data.includes("Q")) {
                    console.log(`Upload info: ${data}`);

                    const cidParseInfo = JSON.parse(data);
                    cidInfo = cidParseInfo.Hash;
                    writeConfig(cidInfo);
                    removeFile("node_modules.zip");
                }
            });

            uploadToIpfs.stderr.on("data", data => {
                console.log(`stderr: ${data}`);
            });

            uploadToIpfs.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });

            uploadToIpfs.on("close", code => {
                console.log(`Upload zip to ipfs  exited with code ${code}`);
                // uploadToIpfs.stdout.on("data", data => {
                //     console.log("🚀 ~ file: cli.js ~ line 45 ~ data", data)
                // })
            })
        }
    });
}

else if (args[0] === "download" && args[1] !== "") {
    const urlIpfs = `https://ipfs.infura.io:5001/api/v0/get?arg=${args[1]}`;
    const downloadFromIpfs = spawn("curl", ["--location", "--request", "POST", urlIpfs, "--output", "node_modules.zip"]);
    downloadFromIpfs.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    downloadFromIpfs.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    downloadFromIpfs.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    downloadFromIpfs.on("close", code => {
        console.log(`Download ipfs  exited with code ${code}`);
        if (code === 0) {
            unzipFile("node_modules.zip");
        }
    })
} else if (args[0] === "--help") {
    getInfo();

} else {
    getInfo()
}

function getInfo() {
    console.log('valid arguments for ipfs-nm');
    console.log('ipfs-nm upload  => upload node-modules to IPFS');
    console.log('ipfs-nm download [CIDarchive] => download archive from IPFS and unzip it to node_modules');
    console.log('ipfs-nm --help => commands info');
}