import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

import { auth } from "./firebase";

let confirmationResult: ConfirmationResult;

export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
};

export const sendOTP = async (
  phone: string,
  verifier: RecaptchaVerifier
) => {
  confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    verifier
  );

  return confirmationResult;
};

export const verifyOTP = async (otp: string) => {
  return await confirmationResult.confirm(otp);
};