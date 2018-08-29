import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guide} from '../class/guide';
import {DisplayPeriodList, EducationList, EmploymentList, ExperienceList, IndustryList, ScheduleList} from '../class/GuideList';
import {Observable, Subject} from 'rxjs';

@Injectable()

export class GuideService {

  public industryNumber: number[];
  public employmentNumber: number[];
  public scheduleNumber: number[];
  public experienceNumber: number[];
  public educationNumber: number[];

  private industryList: Guide[];
  private scheduleList: Guide[];
  private educationList: Guide[];
  private employmentList: Guide[];
  private experienceList: Guide[];

  private displayPeriodList: Guide[];

  private _onCheckIndustryList = new Subject<string>();
  private _onCheckEmploymentList = new Subject<string>();
  private _onCheckScheduleList = new Subject<string>();
  private _onCheckExperienceList = new Subject<string>();
  private _onCheckEducationList = new Subject<string>();

  constructor( private http: HttpClient) {}

  public get onCheckEducationList(): Observable<string> { return this._onCheckEducationList.asObservable(); }
  public startCheckEducationList(value: string): number[] {
    this._onCheckEducationList.next(value);
    return this.educationNumber;
  }

  public get onCheckExperienceList(): Observable<string> { return this._onCheckExperienceList.asObservable(); }
  public startCheckExperienceList(value: string): number[] {
    this._onCheckExperienceList.next(value);
    return this.experienceNumber;
  }

  public get onCheckScheduleList(): Observable<string> { return this._onCheckScheduleList.asObservable(); }

  public startCheckScheduleList(value: string): number[] {
    this._onCheckScheduleList.next(value);
    return this.scheduleNumber;
  }

  public get onCheckIndustryList(): Observable<string> { return this._onCheckIndustryList.asObservable(); }

  public startCheckIndustryList(value: string): number[] {
    this._onCheckIndustryList.next(value);
    return this.industryNumber;
  }

  public get onCheckEmploymentList(): Observable<string> { return this._onCheckEmploymentList.asObservable(); }

  public startCheckEmploymentList(value: string): number[] {
    this._onCheckEmploymentList.next(value);
    return this.employmentNumber;
  }





  getIndustryName(i: number): string {
    this.industryList = IndustryList;
    return this.industryList.find(value => value.id === i ).name;
  }



  getIndustryList(): Guide[] {
   this.industryList = IndustryList;
   return this.industryList.sort( ((a, b) => a.order - b.order ) );
  }

  getDisplayPeriodList(): Guide[] {
    this.displayPeriodList = DisplayPeriodList;
    return this.displayPeriodList.sort( ((a, b) => a.order - b.order ) );
  }


  getScheduleName(i: number): string {
    this.scheduleList = ScheduleList;
    return this.scheduleList.find(value => value.id === i ).name;
  }

  getScheduleList(): Guide[] {
    this.scheduleList = ScheduleList;
    return this.scheduleList.sort( ((a, b) => a.order - b.order ) );
  }

//
  getEmploymentName(i: number): string {
    this.employmentList = EmploymentList;
    return this.employmentList.find(value => value.id === i ).name;
  }

  getEmploymentList(): Guide[] {
    this.employmentList = EmploymentList;
    return this.employmentList.sort( ((a, b) => a.order - b.order ) );
  }

  getEducationName(i: number): string {
    this.educationList = EducationList;
    return this.educationList.find(value => value.id === i ).name;
  }

  getEducationList(): Guide[] {
    this.educationList = EducationList;
    return this.educationList.sort( ((a, b) => a.order - b.order ) );
  }

  getExperienceName(i: number): string {
    this.experienceList = ExperienceList;
    return this.experienceList.find(value => value.id === i ).name;
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


