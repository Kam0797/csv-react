// getter/setters ignored for simplicity

//

class FileData {
  public success: boolean;
  public data: Array<Array<string>>;
  public message: string;

  constructor(success: boolean, data: Array<Array<string>>, message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
class ParamIndices {
  public dateIndex: number;
  public amountIndex: number;
  public descIndex: number;
  public typeIndex: number;
  public success: boolean;

  constructor(
    dateIndex: number,
    amountIndex: number,
    descIndex: number,
    typeIndex: number,
    success: boolean
  ) {
    this.dateIndex = dateIndex;
    this.amountIndex = amountIndex;
    this.descIndex = descIndex;
    this.typeIndex = typeIndex;
    this.success = success;
  }
}

const errorLogs = new Map();

class InputFile {
  public file: File;

  // private supportedFileTypes = ["csv"];

  constructor(file: File) {
    this.file = file;
  }

  public text: string = '';

  async parseCSV(nOfCommas: number): Promise<FileData> {
    if (!this.file.name.endsWith(".csv")) {
      return new FileData(false, [], "Fail: file extension mismatch");
    }
    try {
      this.text = await this.readFileText();
      if (!this.text) return new FileData(false, [], "Fail: file seems empty");
    } catch (e) {
      console.error("Error:", e);
      return new FileData(false, [], "Fail: can't read file");
    }

    const lines = this.text.split("\n");
    const allowedCommas = nOfCommas; // hardcode
    for (let i = 0; i < 3; i++) {
      let commasInThisLine = 0;
      for (const char of lines[i]) {
        if (char == ",") commasInThisLine++;
      }
      if (commasInThisLine != allowedCommas) {
        return new FileData(
          false,
          [],
          "Fail: detected inconsistent comma structure, CSV corrupt?"
        );
      }
    }
    const parsedData = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split(",").map((word) => word.trim().toLowerCase()));
    return new FileData(
      true,
      parsedData,
      `Parse success: ${parsedData.length} lines`
    );
  }

  getParamIndices(
    trans: Array<Array<string>>,
    analyseContent: boolean = false
  ): ParamIndices {
    const lineLength = trans[0].length;

    const assessment = new Map([
      ["date", -1],
      ["amount", -1],
      ["type", -1],
      ["desc", -1],
    ]);

    if (!analyseContent) {
      const params = trans[0];
      params.forEach((param, index) => {
        if (["date"].includes(param.trim().toLowerCase())) {
          assessment.set("date", index);
        } else if (["amount"].includes(param.trim().toLowerCase())) {
          assessment.set("amount", index);
        } else if (["type"].includes(param.trim().toLowerCase())) {
          assessment.set("type", index);
        } else if (
          ["description", "desc", "narration"].includes(
            param.trim().toLowerCase()
          )
        ) {
          assessment.set("desc", index);
        }
      });
      const hasUnmatchedCol = Array.from(assessment.values()).includes(-1);
      if (hasUnmatchedCol) {
        console.error("Unable to detect column contexts, AC:OFF");
        console.log("ass", assessment, errorLogs);
        return this.getParamIndices(trans, true); // anyway tries
      }
      // return assessment
      return new ParamIndices(
        assessment.get("date")??-1,
        assessment.get("amount")??-1,
        assessment.get("desc")??-1,
        assessment.get("type")??-1,
        true
      );
    }

    // this part isn't perfect, but attempts to detect cols without depending on row1

    const dateRegex = /^\d{1,4}[/-]\d{1,2}[-/]\d{1,4}$/;
    const amountRegex = /^\d+(\.\d+)?$/;

    for (let i = 0; i < lineLength; i++) {
      const matches = new Map<string, number>([
        ["date", 0],
        ["amount", 0],
        ["type", 0],
        ["desc", 0],
      ]);
      // let colMatches = 0
      for (let j = 0; j < trans.length; j++) {
        const isDate = dateRegex.test(trans[j][i]);
        const isAmount = amountRegex.test(trans[j][i]);
        const isType = ["credit", "debit"].includes(trans[j][i]);

        // console.log("i,j::", i, j, trans[j][i]);
        if (isDate) {
          matches.set("date", (matches.get("date") ?? -1) + 1);
          // colMatches += 1
        } else if (!isDate) {
          // you logic fked up!!
          if (matches.get("date") ?? -1 > 3)
            errorLogs.set(j, `date doesn't match regex`);
        } else if (isAmount) {
          matches.set("amount", (matches.get("amount") ?? -1) + 1);
          // colMatches += 1
        } else if (!isAmount) {
          if (matches.get("amount") ?? -1 > 3)
            errorLogs.set(j, `cant parse amount`);
        } else if (isType) {
          matches.set("type", (matches.get("type") ?? -1) + 1);
          // colMatches += 1
        } else if (!isType) {
          if (matches.get("type") ?? -1 > 3) {
            errorLogs.set(j, "unexpected string in type column");
          }
        } else {
          matches.set("desc", (matches.get("desc") ?? -1) + 1);
          // colMatches += 1
        }
      }
      // console.log('matches:',matches)

      matches.forEach((value, key) => {
        // console.log("##",i,key,value,trans.length-1,value == trans.length-1, colMatches, assessment)
        if (value >= trans.length - 1) assessment.set(key, i); // .length-1 ?
        // console.log("**",key,value, colMatches,assessment.get(key), assessment.get("amount"), assessment)
      });
    }
    const checkDupeSet = new Set();
    assessment.forEach((value) => {
      if (value != -1 && !checkDupeSet.has(value)) {
        checkDupeSet.add(value);
      } else {
        console.error("Unable to detect column contexts");
        console.log("ass", assessment, errorLogs);
        return new ParamIndices(0, 0, 0, 0, false);
      }
    });
    // console.log("ass",assessment, errorLogs)
    return new ParamIndices(
      assessment.get("date")??-1,
      assessment.get("amount")??-1,
      assessment.get("desc")??-1,
      assessment.get("type")??-1,
      true
    );
  }

  private readFileText(): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);

      reader.readAsText(this.file);
    });
  }
}

export { InputFile, ParamIndices };
