import {Vacancy} from './Vacancy';

export class CV{
  // пользователь
  id_user: number;
  // желаемая должность
  Position: string;
  // оплата
  SalaryFrom: number;
  // отрасль
  Industry: number[];
  DisplayPeriod: number;
  City: number;
  // график работы
  Schedule: number[];
  // занятость
  Employment: number[];
  // образование
  Education: number[];
  //опыт работы
  Experience: number[];
  //номер резюме
  id : number;
  //поле для отметок "выбрано"
  bChecked : boolean = false;
  // признак удаленного резюме
  bInvisible : boolean = false;
  //описание образования словами
  sExperience: string = '';
  //описание умений словами
  sSkills: string = '';
  sEducation: string = '';

  bPublish: boolean = false;
}

export class  dataCV extends CV {
  CityName: string;
  EmployerName: string;
  sErrorText: string;
  sDateEnd: string;
  errorEndDay: boolean;
  base64textString = [];
  UserName: string;
  Skills: string = '';
  UName: string = '';
  Avatar_Name: string = '';
  sAvatarPath: string = '';
}
