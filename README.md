
# Inspiration
This package allows you to reduce the installation time of dependencies in node_modules during your development process. This is especially important when you or your teammates  sees errors in the console during the installation of ### `yarn` or ### `npm install` or during the installing packages of your application in production. Using this package is saving traffic 3 times therefore saves programmer time and therefore benefits the business

# How it works
This package archives the node_modules folder and saves such an archive in IPFS and returns ### `(Content Identifier, CID)`. The CID of this archive is writing to the scripts in the file package.json. Now anyone who makes a git pull of this version of the project will be able to fill node_modules with this command without using yarn or npm install In the development process, the programmer can add /remove dependencies from node_modules after which it will call the upload command and now the command will be updated CID. After git push, everyone will be able to use the new version of the archive to update node_modules

# Steps to use the package in your application
1. To use this package, need to install globally by command
 ```
    npm i ipfs-nm -g
 ```

2. For example we as usual staring work with React [React.js](https://create-react-app.dev/)
using commands:
```
    npx create-react-app my-app
    npm i
    npm start
```
Before pushing to your repository we can use the command

```
    ipfs-nm upload
```
in package.json file we can use two new commands in scrips
like as 
```
    "nm-to-ipfs": "ipfs-nm upload",
    "ipfs-to-nm": "ipfs-nm download QmZQMX6xtMrG97Ez8cfmEictnZQxzEX5FMAxpNxr9hrp1S"
```
after push your teammates or script for CI\CD in production server can use 
command to fill node_modules folder
```
    npm run ipfs-to-nm
```
instead 
```
    yarn 
```
or
```
    npm i
```
The command 
```
    "nm-to-ipfs": "ipfs-nm upload"
```
should use when was added or removed packages from node_modules.

The package tested on Linux Ubuntu 22.

It already tested the successful work of the package for the frontend adn backend applications 
as React from [React.js](https://create-react-app.dev/)
installed with command
to see repo 
```
    https://github.com/spreadzp/react-ipfs-node-modules

```
and backend  application from [Express.js](https://expressjs.com/en/starter/installing.html)

to see repo

```
    https://github.com/spreadzp/ipfs-express.js
```
