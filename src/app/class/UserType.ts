import {City} from './City';

export class UserType{

  public UserName: string;
  private EMail: string;
  Password: string;
  public bEmployer: boolean;
  City: number;
  Zip: string;
  Name: string;
  LastName: string;
  Address: string;
  Phone: string;
  Avatar: any;
  Avatar_Name: string;
  Gender: number;
  DateBirth: number;
  ContactPerson: string;
  About: string;
  Web: string;
  Phone2: string;

  constructor(UserName: string, EMail: string, Password: string, bEmployer: boolean,
              City: number, Zip: string, Name: string,
              LastName: string, Address: string, Phone: string, Gender: number, DateBirth: number,
              ContactPerson: string, About: string, Web: string, Phone2: string, Avatar_Name: string
) {
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
    this.ContactPerson = ContactPerson;
    this.About = About;
    this.Web = Web;
    this.Phone2 = Phone2;
    this.Avatar_Name = Avatar_Name;
  }

}
