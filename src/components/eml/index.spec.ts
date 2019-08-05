const fs = require("fs");
const path = require("path");
import { parseEmails } from "./index";

const eml1 = fs.readFileSync(
  path.resolve(
    __dirname,
    "./__mocks__/test-1"
  ),
  "utf-8"
);
describe("EML decoding test suite", () => {
  it("Should return eml object", () => {
    parseEmails([{ Body: eml1 }]);
  });
});
