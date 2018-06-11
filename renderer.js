// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer, remote } = require('electron');
// require('devtron').install();

class Renderer {
  constructor() {
    this.registerListeners();

    this.lines = [];
  }

  renderConsole() {
    document.querySelectorAll("#console")[0].innerHTML = "";
    this.lines.forEach((chunk) => {
      let ps = [];
      chunk.split("\n").forEach((lin) => {
        ps.push(`<p>${lin}</p>`);
      })
      document.querySelectorAll("#console")[0].innerHTML += ps.join("\n");
    });
  }

  registerListeners() {
    ipcRenderer.on('sendRend', (event, props) => {
      console.log({event, props});
      this.lines.push(`${props.thedata}`);
      this.renderConsole();
    });

    document.querySelector('#sendMsgMain').addEventListener('click', () => {
      ipcRenderer.send('sendMain', {
        greeting: 'Hello'
      });
    });

    document.querySelector('#commandBtn').addEventListener('click', () => {
      let cmd = document.querySelector('#commandInput').value

      console.log("cmd sent: ", cmd, "\n");

      ipcRenderer.send('sendCommand', {
        cmd: cmd
      });

      document.querySelector('#commandInput').value = "";
    });
  }
}

window.renderer = new Renderer();
