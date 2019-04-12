export class Language {
  id_cv: number;
  id_language: number;
  id_level: number;
}

export class AdvancedLanguage  {
  public m: Language[];
  public InsertLanguage: boolean = false;
  public id_cv: number = -1;

}
