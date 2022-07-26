const { spawn } = require("child_process");
function removeFile(fileName) {

    const rm = spawn("rm", [`${fileName}`]);
    rm.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });

    rm.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });

    rm.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    rm.on("close", code => {
        console.log(`Remove file ${fileName} exited with code ${code}`);
    });
}

exports.removeFile = removeFile;