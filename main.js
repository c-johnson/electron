// (function() {
//     var childProcess = require("child_process");
//     var oldSpawn = childProcess.spawn;
//     function mySpawn() {
//         console.log('spawn called');
//         console.log(arguments);
//         var result = oldSpawn.apply(this, arguments);
//         return result;
//     }
//     childProcess.spawn = mySpawn;
// })();

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process');
const stringStreamCreator = require('string-to-stream');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8000');

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    console.log('suuup!');
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('sendMain', (event, props) => {
    // let urbProc = spawn('urbit', ['-H', 'test.urbit.org', '/Users/chris/home/proj/urbit/piers/fotbes-haltuc']);
    this.urbProc = spawn('urbit', ['-H', 'test.urbit.org', '-d', '/Users/chris/home/proj/urbit/piers/fotbes-haltuc'], {shell: true, detached: true});

    // urbit -H test.urbit.org /Users/chris/home/proj/urbit/piers/fotbes-haltuc

    this.urbProc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      mainWindow.webContents.send('sendRend', { thedata: data});
    });

    this.urbProc.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      mainWindow.webContents.send('sendRend', { thedata: data});
    });

    // process.stdin.pipe(this.urbProc.stdin);
    process.stdin.on('data', () => {
      const chunk = process.stdin.read();
      console.log('hi');
      if (chunk !== null) {
        process.stdin.pipe(this.urbProc.stdin);
        // this.urbProc.stdin.write(`data: ${chunk}`);
      }
    });

    // sending a message back is a little different
    mainWindow.webContents.send('sendRend', { result: true });
  });

  ipcMain.on('sendCommand', (event, props) => {
    console.log("cmd receieved: " , props.cmd, "\n");
    // stringStreamCreator(props.cmd + "\n").pipe(this.urbProc.stdin, {end: false});
    stringStreamCreator("(add 2 2)\n").pipe(this.urbProc.stdin, {end: false});

    // this.urbProc.stdin.write(props.cmd + "\n");
    // this.urbProc.stdin.end()
  });

  // mainWindow.webContents.send('sendRendererMessage', { result: true });

  // let urbProc = spawn('/usr/local/bin/urbit -H test.urbit.org /Users/chris/home/proj/urbit/piers/fotbes-haltuc');

  // spawn('urbit -H test.urbit.org /Users/chris/home/proj/urbit/piers/fotbes-haltuc', (error, stdout, stderr) => {
  //   console.log(stdout)
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
