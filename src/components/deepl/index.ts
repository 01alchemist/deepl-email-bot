import axios from "axios";

export enum Language {
  English = "EN",
  German = "DE",
  French = "FR",
  Spanish = "ES",
  Portuguese = "PT",
  Italian = "IT",
  Dutch = "NL",
  Polish = "PL",
  Russian = "RU"
}

const AUTH_KEY = process.env.DEEPL_AUTH_KEY;
const baseUrl = "https://api.deepl.com/v2";
const translate = (text: string, lang: string) =>
  `${baseUrl}/translate?auth_key=${AUTH_KEY}&text=${encodeURIComponent(
    text
  )}&source_lang=EN&target_lang=${lang}`;

export async function translateDocs(docs: any[], lang: Language) {
  return await Promise.all(docs.map((doc: any) => translateDoc(doc, lang)));
}

export async function translateDoc(doc: any, lang: Language) {
  const { data } = await axios.get(translate(doc, lang));
  return data;
}

export async function translateText(text: string, lang: Language) {
  const url = translate(text, lang);
  const { data } = await axios.get(url);
  // console.log(data);
  const [translation] = data.translations;
  return translation.text;
}
