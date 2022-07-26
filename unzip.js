const { spawn } = require("child_process");
const { removeFile } = require("./remove-file");
function unzipFile(fileName) {

    const unzip = spawn("unzip", [`${fileName}`, "-d", "./"]);
    unzip.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    unzip.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    unzip.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    unzip.on("close", code => {
        console.log(`Unzip file ${fileName} exited with code ${code}`);
        if (code === 0) {
            removeFile(fileName);
        }

    });
}

exports.unzipFile = unzipFile;