import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private httpService: AuthService) { }

  user: UserTable;
  checkRegisterRadio: boolean;
  constructor() { }

  ngOnInit() {
  }

    this.httpService.getDataUserTable().subscribe(
      (data:UserTable) => {this.user = data;
                                console.log(this.user)}
    )
  }
  newFunction() {
    console.log ('???');
  }
}
