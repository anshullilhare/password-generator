# Locksmith — Secure Password Generator

A fast, responsive password generator that runs fully in the browser. It does not collect, save, or send passwords anywhere.

## Features

- Secure password generation using the browser's `crypto.getRandomValues()` API
- Password-length control, from 8 to 64 characters
- Lowercase, uppercase, numeric, and symbol character options
- Optional removal of visually similar characters (`i`, `l`, `1`, `L`, `o`, `0`, `O`)
- Password-strength and entropy indicator
- One-click copy button
- Responsive layout for phones, tablets, and computers

## Run locally

Open `index.html` in any modern web browser. No installation is required.

## Publish with GitHub Pages

1. Create a new repository on GitHub, for example `password-generator`.
2. Upload `index.html`, `style.css`, `script.js`, and this `README.md` to the repository.
3. Open the repository **Settings** → **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then click **Save**.
6. After GitHub deploys the site, it will show a URL such as `https://your-username.github.io/password-generator/` that you can send to friends.

## Privacy

The website is static: passwords are generated on the visitor's own device and never sent to a server.
