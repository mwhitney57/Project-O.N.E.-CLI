<p align="center">
    <img align="center" src="https://f.mwhitney.dev/icons/project-one-64.png">
    <br>
    <h1 align="center">Project O.N.E. - CLI</h1>
</p>
<p align="center">
    The web command-line interface for Project O.N.E. built using HTML and JavaScript.
    <br><br>
    <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E."><img src="https://img.shields.io/badge/Project%20O.N.E.-3D556B?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUAAAArO0rA6+s0SVw5T2M9VWv///8cYhYEAAAAAXRSTlMAQObYZgAAAFBJREFUGNOFj0EKwEAMAnU0//9yDy3bZXuoOQhDEJV8a3OwSYMBy9iEtgR7AaYESzIOhRlKJJl8QJnnmgOQv48tdIYV6g8wocNb7Kh+jjvnXykdAi0mh4iNAAAAAElFTkSuQmCC" alt="A Project O.N.E. Subproject"></a>
    <img src="https://img.shields.io/badge/version-0.8.0-blue" alt="CLI v0.8.0">
    <img src="https://img.shields.io/badge/language-JavaScript-F7DF1E?logo=javascript" alt="Written in HTML/JavaScript">
    <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-System/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-GPL%203.0-yellow" alt="GPL License v3.0"></a>
</p>

### Table of Contents
- [Description](https://github.com/mwhitney57/Project-O.N.E.-CLI?tab=readme-ov-file#-description)
- [Features](https://github.com/mwhitney57/Project-O.N.E.-CLI?tab=readme-ov-file#-features)
- [Libraries](https://github.com/mwhitney57/Project-O.N.E.-CLI?tab=readme-ov-file#-libraries)
- [Additional Information](https://github.com/mwhitney57/Project-O.N.E.-CLI?tab=readme-ov-file#%E2%84%B9%EF%B8%8F-additional-information)

### 📃 Description
This application is a part of  __Project O.N.E.__

The web CLI for <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.">Project O.N.E.</a>
This acts as a standard client which connects to the <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-Server">Project O.N.E. Server</a> to send and receive information to/from the <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-System">Project O.N.E. System</a>. A desktop alternative to using the CLI would be the <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-Controller">Project O.N.E. Controller</a>.

### ✨ Features
- Connect to the <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-Server">Project O.N.E. Server</a> and send commands to communicate with the <a target="_blank" href="https://github.com/mwhitney57/Project-O.N.E.-System">Project O.N.E. System</a>.
- Since the CLI is built into a website, it can accessed anywhere on almost any device.
- Password-protected for authorized users only.
- [Planned] Support for log retrieval, two-way audio communication (?), and more.

### 📖 Libraries
For proper command-line look and feel:
- `xterm.js` @ <a target="_blank" href="https://github.com/xtermjs/xterm.js">https://github.com/xtermjs/xterm.js</a>
    - Licensed under the <a target="_blank" href="https://github.com/xtermjs/xterm.js/blob/master/LICENSE">MIT License</a>
    - No changes to library's source code.

For encrypting the HTML page with a password:
- `StatiCrypt` @ <a target="_blank" href="https://github.com/robinmoisson/staticrypt">https://github.com/robinmoisson/staticrypt</a>
    - Licensed under the <a target="_blank" href="https://github.com/robinmoisson/staticrypt/blob/main/LICENSE">MIT License</a>
    - No changes to library's source code.

### ℹ️ Additional Information
The CLI authenticates its connection to the server just like any other standard client via an authentication token.
