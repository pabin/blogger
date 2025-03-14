import fs from "node:fs";

export const checkIfFileExists = (filePath: string): boolean => {
  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
};
