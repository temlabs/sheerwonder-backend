export interface SignUpRequestBody {
  username: string;
  password: string;
  email: string;
}

export interface ConfirmSignUpRequestBody {
  username: string;
  confirmationCode: string;
}
