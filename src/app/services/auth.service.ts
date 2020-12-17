import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Users } from './users';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private dbPath = '/users';
  userRef: AngularFireList<Users> = null;
  user_id: any;
  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase
    ) { 
      this.userRef = db.list(this.dbPath);
  }

  loginUser(value){
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  logoutUser(){
    return new Promise((resolve, reject) => {
      if(this.fireAuth.currentUser) {
        this.fireAuth.signOut()
          .then(() => {
            console.log('Log Out');
            //resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  registerUser(value){
    // return new Promise<any>((resolve, reject) => {
    //   this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
    //     .then(
    //       res => resolve(res),
    //       err => reject(err)
    //     );
    // });

    return firebase.auth().createUserWithEmailAndPassword(value.email, value.password).then((user)=>{
      if(user){
        console.log(user);
        this.user_id = user['user'].uid;

        firebase.database().ref('users/' + this.user_id).set({
          fullname: value.fullname,
          email: value.email,
          foto: "https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png",
          lat: 0,
          lng: 0
        });
      }
    });
  }
  
  userDetail(){
    return this.fireAuth.user;
  }

}
