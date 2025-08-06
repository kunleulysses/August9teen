import workerpool from 'workerpool';

function projectionLoop(iterations = 1000) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sin(i) * Math.cos(i / 2);
  }
  return sum;
}

function environmentLoop(iterations = 1000) {
  let product = 1;
  for (let i = 1; i <= iterations; i++) {
    product = (product * ((i % 100) + 1)) % 1000000;
  }
  return product;
}

workerpool.worker({ projectionLoop, environmentLoop });
