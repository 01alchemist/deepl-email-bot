import "source-map-support/register";
import { parseEmails, Email } from "../components/eml";
import { translateText, Language } from "../components/deepl";
import { sendEmails } from "../components/email/sender";
const AWS = require("aws-sdk");
// const util = require("util");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_prod,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_prod,
  region: process.env.AWS_REGION_prod || "eu-west-1"
});

const S3 = new AWS.S3({
  signatureVersion: "v4"
});

type S3Response = {
  Body: Buffer;
};

// async function translateAttachments(
//   attachments: EmailAttachment[],
//   lang: Language
// ) {
//   // let translatedAttachments = [];

//   // attachments.map(attachment => attachment.data)

//   // attachments.forEach(attachment =>{
//   //   translatedAttachments.push()
//   // })
//   console.log(lang);
//   return attachments;
// }

export async function handler(event: any): Promise<any[]> {
  /**
   * Fetch emails from S3 bucket
   */
  const promises = event.Records.map(({ s3 }: { s3: any }) => {
    const Bucket = s3.bucket.name;
    const Key = s3.object.key;
    return S3.getObject({ Bucket, Key }).promise();
  });

  const emls: S3Response[] = await Promise.all(promises);
  const emails = parseEmails(emls);

  const translatedEmails = await Promise.all(
    emails.map(async (email: Email) => {
      const [subject, textBody, htmlBody, attachments] = await Promise.all([
        translateText(email.header.subject, Language.German),
        translateText(email.textBody, Language.German),
        <any>null,
        // translateText(email.htmlBody, Language.German),
        <any>null
        // translateAttachments(email.attachments, Language.German)
      ]);

      const header = {
        ...email.header,
        subject: `${subject} (${email.header.subject})`
      };
      return {
        header,
        textBody: `Original Message:\n${
          email.textBody
        }\n\nTranslated Message:\n${textBody}`,
        htmlBody,
        attachments
      };
    })
  );

  // console.log(translatedEmails);

  await sendEmails(translatedEmails);

  return translatedEmails;
}
