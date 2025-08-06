const { fork } = require('child_process');
const path = require('path');

describe('Memory Leak Test', () => {
    it('should not show significant heap growth over a sustained period', (done) => {
        jest.setTimeout(16 * 60 * 1000); // 16 minutes

        const testScript = path.resolve(__dirname, 'heartbeat-test.js');
        const proc = fork(testScript, [], {
            execArgv: ['--expose-gc'],
            silent: true // Suppress child process stdout/stderr in test output
        });

        const heapReadings = [];
        let initialHeap = null;

        proc.on('message', (msg) => {
            if (msg.type === 'heap') {
                if (initialHeap === null) {
                    initialHeap = msg.value;
                }
                heapReadings.push(msg.value);
            }
        });

        proc.on('exit', (code) => {
            expect(code).toBe(0);

            // Analyze heap readings
            const lastHeap = heapReadings[heapReadings.length - 1];
            const heapGrowth = (lastHeap - initialHeap) / initialHeap;

            console.log(`Initial Heap: ${initialHeap}`);
            console.log(`Final Heap:   ${lastHeap}`);
            console.log(`Heap Growth:  ${(heapGrowth * 100).toFixed(2)}%`);
            console.log('Heap Readings:', heapReadings);


            // Allow for a small amount of heap growth, but fail if it's excessive.
            // A 10% growth is a reasonable threshold for this kind of test.
            expect(heapGrowth).toBeLessThan(0.10);

            done();
        });
    });
});