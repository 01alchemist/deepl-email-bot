const fs = require("fs");
const path = require("path");
import { parseEML } from "./eml-parser";

const eml1 = fs.readFileSync(
  path.resolve(
    __dirname,
    "./__mocks__/7q61gh4nqjumnuua9erm8hir3btqmv1084dond81"
  ),
  "utf-8"
);

const eml2 = fs.readFileSync(
  path.resolve(
    __dirname,
    "./__mocks__/multi-line-prop"
  ),
  "utf-8"
);

xdescribe("eml parser test suite", () => {
  it("Should parse eml with attachments", () => {
    parseEML(eml1);
  });
  xit("Should parse eml with attachments", () => {
    parseEML(eml2);
  });
});
