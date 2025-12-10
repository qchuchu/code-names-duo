import CryptoJS from "crypto-js";

const SECRET_KEY = "codenames-duo-secret-2024";

export const encrypt = (data: unknown): string => {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
};

export const decrypt = <T>(encrypted: string): T => {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json) as T;
};
