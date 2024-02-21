# Plakod Space Invador
Plakod is a video game-assisted rehabilitation that aims to increase motivation and build engagement for patients.
[website](https://klongdinsor.com)

## Getting started

### Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

Install dependencies
```bash
npm install
```

### Run
```bash
npm run start
```
Go to `localhost:8000`

### Build
```bash
npm run build
```
Test build file
```bash
cd ./dist
python3 -m http.server
```

### Deploy
Deploy to Github pages with Github Action


### Template
Phaser 3 + TypeScript + Vite.js Template

This is a TypeScript specific fork of [phaser3-vite-template](https://github.com/ourcade/phaser3-vite-template).

### Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── HelloWorldScene.ts
    │   ├── main.ts
	├── index.html
    ├── package.json
```

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

Other than that there is no opinion on how you should structure your project.

There is an example `HelloWorldScene.ts` file that can be placed inside a `scenes` folder to organize by type or elsewhere to organize by function. For example, you can keep all files specific to the HelloWorld scene in a `hello-world` folder.

It is all up to you!

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served from the root. For example: http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

## TypeScript ESLint

This template uses a basic `typescript-eslint` set up for code linting.

It does not aim to be opinionated.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

### Dev Server Port

You can change the dev server's port number by modifying the `vite.config.ts` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```

Change 8000 to whatever you want.

## Deployment

CI/CD will be setup to Google Firebase hosting. Project name [plakod-game[(https://console.firebase.google.com/project/plakod-game/overview)
There are 2 branches develop and production. Develop branch will be deployed on [plakod-development.firebaseapp.com](plakod-development.firebaseapp.com) while Production will be deployed on [plakod.firebaseapp.com](plakod.firebaseapp.com)

Create new Firebase hosting channel
```sh
$ npm exec -- firebase hosting:channel:create CHANNEL_ID
```

list all Firebase hosting channel
```sh
$ npm exec -- firebase hosting:channel:list
```

### Deploying with another site ID

Currently we use plakod-game.web.app but we can have multple xxx.web.app

Create new site ID
```sh
$ npm exec -- firebase hosting:sites:create SITE_ID
```

Delete site ID
```sh
$ npm exec -- firebase hosting:sites:delete SITE_ID
```

Deploy
```sh
$ firebase deploy --only hosting:TARGET_NAME
```

[see more](https://firebase.google.com/docs/hosting/multisites)

## Special Thanks
- [Kenney](www.kenney.nl) for most of the [graphics](https://www.kenney.nl/assets/space-shooter-redux)
- [Phaser](https://phaser.io/) for the game library
- [Pixabay](https://pixabay.com/) for sound effect