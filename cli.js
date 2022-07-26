#!/usr/bin/env node

const { spawn } = require("child_process");

const [, , ...args] = process.argv
const { removeFile } = require("./remove-file")
console.log(`Command ${args}`);

const { writeConfig } = require("./manage-config");
const { unzipFile } = require("./unzip");

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

    ls.on("close", code => {
        console.log(`zip process exited with code ${code}`);
        if (code === 0) {
            const uploadToIpfs = spawn("ipfs", ["add", "node_modules.zip"]);
            let cid = "";
            uploadToIpfs.stdout.on("data", data => {
                if (data.includes("Q")) {
                    const splitData = data.toString().split(" ");
                    splitData.map(item => {
                        if (item.includes("Q")) {
                            cid = item;
                            writeConfig(cid);
                            removeFile("node_modules.zip")
                        }
                    })
                }
                console.log(`!!!stdout: ${data}`);
                console.log('cid :>> ', cid);
                if (cid !== "") {

                }
            });

            uploadToIpfs.stderr.on("data", data => {
                console.log(`stderr: ${data}`);
            });

            uploadToIpfs.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });

            uploadToIpfs.on("close", code => {
                console.log(`Upload ipfs  exited with code ${code}`);
                uploadToIpfs.stdout.on("data", data => {
                    console.log("🚀 ~ file: cli.js ~ line 45 ~ data", data)
                })
            })
        }
    });
}

else if (args[0] === "download" && args[1] !== "") {
    let cidName = "";
    const downloadFromIpfs = spawn("ipfs", ["get", args[1]]);
    downloadFromIpfs.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
        if (data.toString().includes("Saving file(s) to")) {
            const splitInfo = data.toString().split(" ");
            cidName = splitInfo[3].replace(/\\n/g, '').trim();
        }
    });

    downloadFromIpfs.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    downloadFromIpfs.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    downloadFromIpfs.on("close", code => {
        console.log(`Download ipfs  exited with code ${code}`);
        if (code === 0 && cidName !== "") {
            const rename = spawn("cp", [`${cidName}`, "node_modules.zip", "-i", "-u"]);
            rename.stdout.on("data", data => {
                console.log(`stdout: ${data}`);
            });
            rename.stderr.on("data", data => {
                console.log(`Rename file  stderr: ${data}`);
            });

            rename.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });
            rename.on("close", code => {
                console.log(`Rename file  exited with code ${code}`);
                if (code === 0) {
                    removeFile(cidName);
                    unzipFile("node_modules.zip");

                }
            })
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