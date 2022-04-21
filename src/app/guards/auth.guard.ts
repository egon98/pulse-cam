import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {AlertController} from "@ionic/angular";
import {filter, map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    //const expectedRole = route.data?.role;
    return this.authService.getUser().pipe(
      filter(val => val !== null),
      take(1),
      map(user => {
        console.log('aasd')
        if(!user) {
          this.showAlert();
          return this.router.parseUrl('/')
        }
      })
    );
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You do not have permission to visit that page!',
      buttons: ['OK']
    });
    await alert.present();
  }


}
