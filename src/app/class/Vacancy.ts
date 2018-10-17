
export class Vacancy{
  VacancyShortTitle: string;
  VacancyDescription: string;
  VacancyBigDescription: string;
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

}

export class  dataVacancy extends Vacancy {
  CityName: string;
  EmployerName: string;
}
