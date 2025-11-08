// getter/setters ignored for simplicity

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

  constructor(
    dateIndex: number,
    amountIndex: number,
    descIndex: number,
    typeIndex: number
  ) {
    this.dateIndex = dateIndex;
    this.amountIndex = amountIndex;
    this.descIndex = descIndex;
    this.typeIndex = typeIndex;
  }
}

const errorLogs = new Map()

class InputFile {
  public file: File;

  private supportedFileTypes = ["csv"];

  constructor(file: File) {
    this.file = file;
  }

  public text: string;

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
    const parsedData = lines.filter(line => line.trim().length > 0).map((line) => line.split(","));
    return new FileData(
      true,
      parsedData,
      `Parse success: ${lines.length} lines`
    );
  }

  async analyseTransactions(
    trans: Array<Array<string>>,
    params: ParamIndices
  ): Promise<Object> {}

  detectParamIndices(trans: Array<Array<string>>) {
    const lineLength = trans[0].length;
    // console.log('wtf', trans)

    
    const assessment = new Map([["date",-1],["amount",-1],["type",-1],["desc",-1]])
    for (let i = 0; i < lineLength; i++) {
      let matches = new Map([["date",0],["amount",0],["type",0],["desc",0]])
      let colMatches = 0
      for (let j = 0; j < trans.length; j++) {
        // console.log("i,j::", i, j, trans[j][i]);
        if(/^\d{1,4}[/-]\d{1,2}[-/]\d{1,4}$/.test(trans[j][i].trim())) {
          matches.set("date", matches.get("date")+1)
          colMatches += 1
          console.log("date:",trans[j][i])
        }
        else{
          if(colMatches > 3)
          errorLogs.set(j,`date doesnt match regex`)
        }
        if(/^\d+(\.\d+)?$/.test(trans[j][i].trim())) {
          matches.set("amount", matches.get("amount")+1)
          colMatches += 1
          console.log("amt:",trans[j][i])
        }
        else {
          if(colMatches > 3)
            errorLogs.set(j,`cant parse amount`)
        }
        if(trans[j][i].toLowerCase == "credit" || trans[j][i].toLowerCase == "debit" || trans[j][i].toLowerCase == "expense" || trans[j][i].toLowerCase == "income") {
          matches.set("type", matches.get("type")+1)
          colMatches += 1
          console.log("type:",trans[j][i])
        }
        else{
          if(colMatches > 3) {
            errorLogs.set(j,"unexpected string in type column")
          }
        }
      }
      // console.log('matches:',matches)

      matches.forEach((value,key)=> {
        console.log("##",i,key,value,trans.length-1,value == trans.length-1, colMatches, assessment)
        if(value == trans.length-1) assessment.set(key,i)
        console.log("**",key,value, colMatches,assessment.get(key), assessment.get("amount"), assessment)

      })

    }
    const checkDupeSet = new Set()
    assessment.forEach(value => {
      if(!checkDupeSet.has(value)) {
        checkDupeSet.add(value)
      }
      else {
        console.error("Unable to detect column contexts")
        console.log("ass",assessment, errorLogs)
        return
      }
    
      
    })
    console.log("ass",assessment, errorLogs)
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

export { InputFile };
