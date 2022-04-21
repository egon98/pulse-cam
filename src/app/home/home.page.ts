import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  user = this.authService.getUser();

  ngOnInit() {
  }

  async logout() {
    await this.authService.logOut();
    this.router.navigateByUrl('/', {replaceUrl: true});
  }

}
