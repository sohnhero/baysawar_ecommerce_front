console.log('Diagnostic Start');
const start = Date.now();
setTimeout(() => {
  console.log(`Diagnostic End. Took ${Date.now() - start}ms`);
  process.exit(0);
}, 100);
