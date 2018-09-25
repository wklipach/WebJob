import {City} from './City';

export class UserType{

  private UserName: string;
  private EMail: string;
  private Password: string;
  private bEmployer: boolean;
  City: number;
  Zip: string;
  Name: string;
  LastName: string;
  Address: string;
  Phone: string;

  constructor(UserName: string, EMail: string, Password: string, bEmployer: boolean,
              City: number, Zip: string, Name: string,
              LastName: string, Address: string, Phone: string) {
    this.UserName = UserName;
    this.EMail = EMail;
    this.Password = Password;
    this.bEmployer = bEmployer;
    this.City = City;
    this.Zip = Zip;
    this.Name = Name;
    this.LastName = LastName;
    this.Address = Address;
    this.Phone = Phone;
  }

}
