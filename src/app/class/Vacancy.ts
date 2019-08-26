
export class Vacancy{
  VacancyShortTitle: string;
  VacancyDescription: string;
  //условия (текстовое поле)
  Conditions: string;
  SalaryFrom: number;
  Salary: number;
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
  // опыт работы
  Experience: number[];
  id : number;
  //создатель вакансии
  id_user : number;
  //дата создания вакансии
  DateTimeCreate: string;
  //поле для отметок "выбрано"
  bChecked : boolean = false;
  // признак удаленного резюме
  bInvisible : boolean = false;
  // должностные обязанности
  JobFunction: string;
  // Требования
  VacancyRequirements: string;

}

export class  dataVacancy extends Vacancy {
  CityName: string;
  CityName1: string;
  CityName2: string;
  EmployerName: string;
  sErrorText: string;
  sDateEnd: string;
  errorEndDay: boolean;
  base64textString = [];
  UserName: string;
  UNAME: string;
  Avatar_Name: string = '';
  sAvatarPath: string = '';

}
