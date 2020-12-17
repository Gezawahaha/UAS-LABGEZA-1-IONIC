import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FriendService } from '../services/friend.service';
import { UserService } from '../services/user.service';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  friend: any;
  searchFriend: any;
  userId: string;
  userData: any;
  searchControl: FormControl;
  friendList= [];
  userFriend = [];
  userList = [];
  resetFriend = [];

  constructor(
    private authSrv: AuthService,
    private friendSrv: FriendService,
    private userSrv: UserService
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit(){
    this.authSrv.userDetail().subscribe(res => {
      console.log(res);
      if(res !== null){
        this.userId = res.uid;

        this.friendSrv.getAllFriend(this.userId).snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data => {
          this.friend = data;
          this.userFriend = this.friend;
          console.log(this.userFriend);

          this.userSrv.getAllUser().snapshotChanges().pipe(
            map(changes =>
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
              )
          ).subscribe(data => {
            this.userData = data;
            this.userList = this.userData;
            console.log(this.userList, this.userFriend[0].email);
            let j = 0;
            for(let i = 0; i < this.userList.length;){
              if(this.userList[i].email == this.userFriend[j].email){
                console.log('sama');
                this.friendList[j] = this.userData[j];
                this.resetFriend[j] = this.userData[j];
                console.log(this.friendList[j]);
                i=0;
                j++;
                if(j == this.userFriend.length){
                  break;
                }
              }else{
                i++;
              }
            }

            this.setFilteredItems("");
            this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(search => {
              this.setFilteredItems(search);
            });
            //this.compareData(this.friend.length, this.userData.length);
          });
        });
      }
    })
  }

  setFilteredItems(searchTerm: string) {
    this.friendList = this.resetFriend;
    this.friendList = this.friendList.filter(item => {
      return item.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    })
  }

  ionViewWillEnter(){
    
  }

}