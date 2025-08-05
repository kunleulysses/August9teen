const { exec } = require('child_process');

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function main() {
  console.log('Starting Redis chaos test...');

  console.log('Pausing Redis container for 30 seconds...');
  await run('docker-compose pause redis');
  await new Promise(resolve => setTimeout(resolve, 30000));
  await run('docker-compose unpause redis');
  console.log('Resumed Redis container.');

  console.log('Injecting 500ms network delay and 2% packet loss for 60 seconds...');
  await run('docker-compose exec -T redis tc qdisc add dev eth0 root netem delay 500ms loss 2%');
  await new Promise(resolve => setTimeout(resolve, 60000));
  await run('docker-compose exec -T redis tc qdisc del dev eth0 root');
  console.log('Removed network delay and packet loss.');

  console.log('Chaos test complete.');
}

main();