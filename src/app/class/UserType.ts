import {City} from './City';

export class UserType{

  public UserName: string;
  private EMail: string;
  Password: string;
  private bEmployer: boolean;
  City: number;
  Zip: string;
  Name: string;
  LastName: string;
  Address: string;
  Phone: string;
  Avatar: any;
  Gender: number;
  DateBirth: number;

  constructor(UserName: string, EMail: string, Password: string, bEmployer: boolean,
              City: number, Zip: string, Name: string,
              LastName: string, Address: string, Phone: string, Gender: number, DateBirth: number) {
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
    this.Gender= Gender;
    this.DateBirth = DateBirth;
  }

}
