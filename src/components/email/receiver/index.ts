const Imap = require("imap");
const util = require("util");
const inspect = util.inspect;

type MailReceiverOptions = {};
export class MailReceiver {
  imap: any;
  constructor(options: MailReceiverOptions = {}) {
    console.log(options);

    this.imap = new Imap({
      user: "deepl.bot.01@gmail.com",
      password: "fdYOZb56N4t2",
      host: "imap.gmail.com",
      port: 993,
      tls: true
    });
    this.imap.once("error", function(err: Error) {
      console.log(err);
    });

    this.imap.once("end", function() {
      console.log("Connection ended");
    });

    this.imap.once("ready", async () => {
      const box: any = await this.openInbox();
      this.read(box);
    });

    this.imap.connect();
  }
  async openInbox() {
    await util.promisify(this.imap.openBox)("INBOX", true);
  }
  read(box: any) {
    console.log(box);

    var f = this.imap.seq.fetch("1:3", {
      bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
      struct: true
    });

    f.on("message", (msg: any, seqno: any) => {
      console.log("Message #%d", seqno);
      var prefix = "(#" + seqno + ") ";

      msg.on("body", (stream: any, info: any) => {
        console.log(info);

        var buffer = "";
        stream.on("data", (chunk: any) => {
          buffer += chunk.toString("utf8");
        });
        stream.once("end", () => {
          console.log(
            prefix + "Parsed header: %s",
            inspect(Imap.parseHeader(buffer))
          );
        });
      });
      msg.once("attributes", (attrs: any) => {
        console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
      });
      msg.once("end", () => {
        console.log(prefix + "Finished");
      });
    });

    f.once("error", (err: Error) => {
      console.log("Fetch error: " + err);
    });

    f.once("end", () => {
      console.log("Done fetching all messages!");
      this.imap.end();
    });
  }
}
