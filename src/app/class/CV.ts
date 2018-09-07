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

}
