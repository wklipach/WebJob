export class UserType{

  private UserName: string;
  private EMail: string;
  private Password: string;
  private bEmployer: boolean

  constructor(UserName: string, EMail: string, Password: string, bEmployer: boolean) {
    this.UserName = UserName;
    this.EMail = EMail;
    this.Password = Password;
    this.bEmployer = bEmployer;
  }

}
