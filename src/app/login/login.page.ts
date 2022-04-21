import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController, Platform} from "@ionic/angular";
import {Auth, signOut} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  subscription: any;
  credentials: FormGroup;


  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private auth: Auth,
              private authService: AuthService,
              private router: Router,
              private platform: Platform,
              private alertController: AlertController) {

  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get role() {
    return this.credentials.get('role')
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if(user) {
      await this.router.navigate(['/home', {replaceUrl: true}]);
    } else {
      await this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user) {
      await this.router.navigateByUrl('home');
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  logout() {
    return signOut(this.auth);
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


}
