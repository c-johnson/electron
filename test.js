process.stdin.setEncoding('utf8');

process.stdin.on('data', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});

// process.stdout.write(`sup\n`);
// console.log('sup2');

setInterval(function() {
    console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);

process.stdin.pipe(process.stdout);
