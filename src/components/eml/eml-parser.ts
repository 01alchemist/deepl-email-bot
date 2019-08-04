function parseKeyValue(str: string) {
  let buffer = "";
  let key = "";
  let keyFound = false;
  for (let char of str) {
    buffer += char;
    if (!keyFound && char === ":") {
      key = buffer.substring(0, buffer.length - 1);
      buffer = "";
      keyFound = true;
    }
  }
  return [key, buffer];
}

type ParseResult = {
  currentLine: number;
  contents: any;
};

function parseProperties(lines: string[]): ParseResult {
  const contents: any = {};
  let currentKey: string;
  let currentLine = 0;
  lines.some((line: string, i: number) => {
    currentLine = i;
    const startedWithSpace = line.startsWith(" ");

    if (!startedWithSpace) {
      const [key, value] = parseKeyValue(line);
      if (key === "Content-Type") {
        return true;
      } else {
        currentKey = key;
        contents[key] = value;
      }
    } else {
      contents[currentKey] += `\n${line}`;
    }
    return false;
  });
  return { currentLine, contents };
}

// function parseContent(lines: string[], offset: number): any {
//   const content: any = {};
//   let boundary;
//   let currentLine = offset;
//   const contentType = lines[offset++];
//   if (contentType) {
//     const type = parseKeyValue(contentType);
//     console.log(type);
//     content.type = type;

//     for (let i = offset; i < lines.length; i++) {
//       currentLine = i;
//       const line = lines[i];
//       const isEmptyLine = line === "";
//       const startedWithDash = line.startsWith("--");

//       if (isEmptyLine) {
//       } else if (startedWithDash) {
//         const newBoundary = line.substring(2, line.length);
//         if(boundary === newBoundary) {

//         }
//       } else {
//         const [key, value] = parseKeyValue(line);
//         if (key === "Content-Type") {
//           parseContents(lines);
//           return true;
//         }
//         content[key] = value;
//       }
//       return false;
//     }
//   }
//   return { offset: currentLine, content };
// }

function parseContents(lines: string[]): any {
  const currentContent: any = {};
  const contents: any[] = [currentContent];
  let currentLine = 0;
  let boundary;
  lines.some((line: string, i: number) => {
    currentLine = i;
    const isEmptyLine = line === "";
    const startedWithDash = line.startsWith("--");

    if (isEmptyLine) {
    } else if (startedWithDash) {
      boundary = line.substring(2, line.length);
      currentContent[boundary] = boundary;
    } else {
      const [key, value] = parseKeyValue(line);
      if (key === "Content-Type") {
        parseContents(lines);
        return true;
      }
      currentContent[key] = value;
    }
    return false;
  });
  return { currentLine, contents };
}

// function parseBoundaryContent() {}

export function parseEML(data: string): any {
  const lines = data.split("\n").filter(line => line);

  const { currentLine, contents: properties } = parseProperties(lines);

  const emlObj: any = { ...properties };

  console.log("currentLine:", currentLine);

  const { contents } = parseContents(lines.slice(currentLine));

  emlObj.contents = contents;

  console.log(contents);

  return emlObj;
}
