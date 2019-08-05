import { handler } from "./translate-email";
const event1 = require("./__mocks__/s3-event-1.json");
const event2 = require("./__mocks__/s3-event-2.json");

xdescribe("translate-email test suite", () => {
  xit("Should return email object", async () => {
    await handler(event1);
  });
  it("Should return email object with attachments", async () => {
    const [email] = await handler(event2);
    console.log(email);
    expect(email.textBody).toBeDefined()
  });
});
