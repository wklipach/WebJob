export class Previous {
  id_cv: number;
  dStartDate: Date;
  dCompletionDate: Date;
  nStartDate: number;
  nCompletionDate: number;

  sCompany: string;
  sPreviousPosition: string;
  sInputPositionDescription: string;
  sInputSkillsAbilities: string;
}

export class AdvancedPrevious  {
  public m: Previous[];
  public InsertPrevious: boolean = false;
  public id_cv: number = -1;

}
