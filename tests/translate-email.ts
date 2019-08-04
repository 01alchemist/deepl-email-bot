const { handler } = require("../src/functions/translate-email");
const event1 = require("../src/functions/__mocks__/s3-event-2.json");

async function main() {
  await handler(event1);
}

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
