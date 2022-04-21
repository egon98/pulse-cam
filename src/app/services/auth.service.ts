import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {BehaviorSubject, of} from "rxjs";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";

const TOKEN_KEY = 'user-token';

export interface User {
  name: string;
  role: string;
  pemissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private auth: Auth, private storage: Storage, private router: Router) {
    this.storage.create();
  }



  signIn(name) {
    let userObj: User;

    return of(userObj).pipe(
      tap(user =>{
        this.storage.set(TOKEN_KEY, JSON.stringify(user));
        this.currentUser.next(user);
      })
    );
  }

  getUser() {
    return this.currentUser.asObservable();
  }

  async logOut() {
    await this.storage.remove(TOKEN_KEY);
    this.currentUser.next(false);
    await this.router.navigateByUrl('/', {replaceUrl: true})
  }

  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if(!this.currentUser.value || !this.currentUser.value.pemissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }

  async register({email, password}) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch(e) {
      return null;
    }
  }

  async login({email, password}) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch(e) {
      return null;
    }
  }


}
