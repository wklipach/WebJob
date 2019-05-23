import { Component, OnInit } from '@angular/core';
import {Letter} from '../../../class/Letter';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {LetterService} from '../../../services/letter.service';
import index from '@angular/cli/lib/cli';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {


  constructor () {

  }


}
