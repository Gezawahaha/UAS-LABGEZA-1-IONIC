import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Users } from './users';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  private dbPath = '/users';
  usersRef: AngularFireList<Users> = null;
  constructor(
    private db: AngularFireDatabase
  ) {
    this.usersRef = db.list(this.dbPath);
  }

  getDataUsers(key: string): AngularFireList<Users>{
    this.dbPath = '/users/' + key;
    this.usersRef = this.db.list(this.dbPath);
    return this.usersRef;
  }
  getUsers(usersid: string){
    return this.db.object('users/' + usersid).valueChanges();
  }

  update(usersid: string, value:any): Promise<void> {
    console.log(value);
    return this.usersRef.update(usersid, value);
  }

  upLoc(lat: number, lng: number, userId: string){
    this.usersRef = this.db.list('/user');
    return this.usersRef.update(userId, {
      lat: lat,
      lng: lng
    });
  }

  getAllUser(){
    return this.usersRef;
  }

  // uploc(lat: number, lng:number, userid: string){
    
  //   this.usersRef = this.db.list('user');
  //   console.log(lat,lng);
  //   return this.usersRef.update(userid, value);
    
    
  // }

}
