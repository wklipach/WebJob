import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guide} from '../class/guide';
import {DisplayPeriodList, EducationList, EmploymentList, ExperienceList, IndustryList, ScheduleList} from '../class/GuideList';

@Injectable()

export class GuideService {

  private industryList: Guide[];
  private displayPeriodList: Guide[];
  private scheduleList: Guide[];
  private educationList: Guide[];
  private employmentList: Guide[];
  private experienceList: Guide[];

  constructor( private http: HttpClient) {

  }

  getIndustryList(): Guide[] {
   this.industryList = IndustryList;
   return this.industryList.sort( ((a, b) => a.order - b.order ) );
  }

  getDisplayPeriodList(): Guide[] {
    this.displayPeriodList = DisplayPeriodList;
    return this.displayPeriodList.sort( ((a, b) => a.order - b.order ) );
  }


  getScheduleList(): Guide[] {
    this.scheduleList = ScheduleList;
    return this.scheduleList.sort( ((a, b) => a.order - b.order ) );
  }

//
  getEmploymentList(): Guide[] {
    this.employmentList = EmploymentList;
    return this.employmentList.sort( ((a, b) => a.order - b.order ) );
  }

  getEducationList(): Guide[] {
    this.educationList = EducationList;
    return this.educationList.sort( ((a, b) => a.order - b.order ) );
  }

  getExperienceList(): Guide[] {
    this.experienceList = ExperienceList;
    return this.experienceList.sort( ((a, b) => a.order - b.order ) );
  }

//

  getCityTable()
  {
    // вставить запрос типа select top 10 * from City
    return this.http.get('http://localhost:3000/City');
  }

}


