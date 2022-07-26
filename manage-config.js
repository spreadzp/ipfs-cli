const fs = require('fs');

function writeConfig(cid) {
    const pathConfig = './package.json';
    fs.readFile(pathConfig, 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        const config = JSON.parse(data);

        config.scripts["nm-to-ipfs"] = `ipfs-nm upload`;
        config.scripts["ipfs-to-nm"] = `ipfs-nm download ${cid}`;  

        fs.writeFile(pathConfig, JSON.stringify(config, null, 2), (error) => {
            if (error) {
                console.log('An error has occurred ', error);
                return;
            }
            console.log('New commands written successfully to file');
        });
    })
}

exports.writeConfig = writeConfig;