import {Guide} from './guide';

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
  //опыт работы
  Experience: number[];
}
