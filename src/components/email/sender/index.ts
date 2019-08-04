import { Email } from "../../eml";
let nodemailer = require("nodemailer");
let aws = require("aws-sdk");

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01"
  })
});

export async function sendEmail({ from, to, subject, text }: any) {
  console.log("----------------------------------------");
  console.log({ from, to, subject, text });
  console.log("----------------------------------------");

  return new Promise(function(resolve, reject) {
    transporter.sendMail(
      {
        from,
        to,
        subject,
        text
      },
      (error: Error, info: any) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(info.envelope);
          console.log(info.messageId);
          resolve(info);
        }
      }
    );
  });
}
export async function sendEmails(emails: Email[]) {
  // console.log(emails[0]);
  return await Promise.all(
    emails.map(email => {
      const header = email.header;
      const { from, to, subject } = header;

      return sendEmail({
        from: to.address,
        to: from.address,
        subject,
        text: email.textBody
      });
    })
  );
  // send some mail
}
