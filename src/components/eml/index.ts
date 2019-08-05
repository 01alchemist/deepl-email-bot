const util = require("util");
const emlformat = require("eml-format");
const Envelope = require("envelope");

const readEml = util.promisify(emlformat.read);

export async function readEmlFile(eml: Buffer) {
  try {
    return await readEml(eml.toString());
  } catch (e) {
    console.log(e);
  }
  return null;
}

// const parseEml = util.promisify(emlformat.parse);

export function parseEmlFile(eml: string) {
  try {
    return new Envelope(eml);
  } catch (e) {
    console.log(e);
  }
  return null;
}

export type EmailAttachment = {
  header: { [key: string]: any };
  data: any;
};
export type Email = {
  header: { [key: string]: any };
  textBody: string;
  htmlBody: string;
  attachments: EmailAttachment[];
};

export function parseEmails(_emails: any[]): Email[] {
  return _emails.map(({ Body }) => {
    const content = Body.toString();
    const email = parseEmlFile(content);
    console.log(util.inspect(email), { depth: null });

    const attachments: EmailAttachment[] = [];
    Object.keys(email).forEach(index => {
      const item = email[index];
      if (
        item.header &&
        item.header.contentDisposition &&
        item.header.contentDisposition.mime === "attachment"
      ) {
        const { "0": data, header } = item;
        attachments.push({ header, data });
      }
    });

    const body = email["0"];
    console.log(email.header);

    let textBody = "";
    let htmlBody = "";

    if (email.header.contentType.mime === "multipart/alternative") {
      textBody = email["0"]["0"];
      htmlBody = email["1"]["0"];
    } else if (body.header.contentType.mime === "multipart/alternative") {
      textBody = body["0"]["0"];
      htmlBody = body["1"]["0"];
    } else if (body.header.contentType.mime === "multipart/mixed") {
      textBody = body["0"]["0"]["0"];
      htmlBody = body["0"]["1"]["0"];
    }
    return <Email>{
      header: email.header,
      textBody,
      htmlBody,
      attachments
    };
  });
}
