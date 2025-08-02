import { CodeAnalyzer } from './FlappyJournal/server/consciousness/code-analyzer.js';

async function testCodeAnalyzer() {
    const analyzer = new CodeAnalyzer();
    
    const testCode = `
    function complexFunction(x) {
        if (x > 10) {
            for (let i = 0; i < x; i++) {
                console.log(i);
                if (i % 2 === 0) {
                    console.log('even');
                } else {
                    console.log('odd');
                }
            }
        }
        return x * 2;
    }
    `;

    console.log('Testing code analysis...');
    const analysis = await analyzer.analyze(testCode);
    console.log('Analysis results:');
    console.log(JSON.stringify(analysis, null, 2));

    console.log('\nTesting pattern detection...');
    const patterns = await analyzer.detectPatterns(testCode);
    console.log('Pattern detection results:');
    console.log(JSON.stringify(patterns, null, 2));

    console.log('\nTesting stats gathering...');
    const stats = await analyzer.gatherStats(testCode);
    console.log('Stats results:');
    console.log(JSON.stringify(stats, null, 2));
}

testCodeAnalyzer().catch(console.error);
