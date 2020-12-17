import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FriendService } from '../services/friend.service';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';


declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  latitude: any;
  longitude: any;
  map: any;
  users: any;
  value: any;
  userID: string;
  userEmail: string;
  imgSrc:string;
  userData: any;
  searchControl: FormControl;
  friendList= [];
  userFriend = [];
  userList = [];
  resetFriend = [];
  friend: any;


  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  constructor(
    private geolocation: Geolocation,
    private authSrv: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private userSrv: UserService,
    private friendSrv: FriendService
    ) {}

  ngOninit(){
    this.authSrv.userDetail().subscribe(res => {
      // console.log(res);
      if(res!==null){
        this.userID = res.uid;
      }else{
        // this.router.navigateByUrl('/menu');
        this.router.navigateByUrl('/login');
        //this.alertNoUser();
      }
    }, err => {
      console.log(err);
    });
    
  }

  ionViewDidEnter(){
    this.authSrv.userDetail().subscribe(res => {
      // console.log(res);
      if(res!==null){
        this.userEmail = res.email;
        this.userID = res.uid;
        
        this.users = this.db.object('/users/' + this.userID).valueChanges().subscribe(data => {
          this.users = data;
          this.imgSrc =  this.users.foto;
          
        });
      }else{
        // this.router.navigateByUrl('/menu');
        this.router.navigateByUrl('/login');
        //this.alertNoUser();
      }if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const posUser = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(posUser.lat, posUser.lng, this.userID);
          this.userSrv.upLoc(posUser.lat, posUser.lng, this.userID);
          const location = new google.maps.LatLng(posUser.lat, posUser.lng);
          const options = {
            center: location,
            zoom: 13,
            disableDefaultUI: true
          };
  
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          console.log(posUser);
          this.map.setCenter(posUser);
  
          const marker = new google.maps.Marker({
            position: posUser,
            map: this.map,
          });

          this.friendSrv.getAllFriend(this.userID).snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
              )
          ).subscribe(data => {
            this.friend = data;
            this.userFriend = this.friend;
  
            this.userSrv.getAllUser().snapshotChanges().pipe(
              map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
                )
            ).subscribe(data => {
              this.userData = data;
              this.userList = this.userData;
              let j = 0;
              for(let i = 0; i < this.userList.length;){
                if(this.userList[i].email == this.userFriend[j].email){
                  this.friendList[j] = this.userData[j];
                  const posFriend = {
                    lat: this.friendList[j].lat,
                    lng: this.friendList[j].lng
                  }
                  const marker = new google.maps.Marker({
                    position: posFriend,
                    map: this.map,
                  });

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
              console.log(this.friendList);
              for(let i = 0; i < this.friendList.length; i++){
                
              }
              //this.compareData(this.friend.length, this.userData.length);
            });
          });

        });
      }


    }, err => {
      console.log(err);
    });
    
    


  }



  ngAfterViewInit(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const map = new google.maps.Map(this.mapRef.nativeElement, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 16
      });
      /*location object*/
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };

      
      
      map.setCenter(pos);
      const icon = {
        url: 'assets/icon/push-pin.png', // image url
        scaledSize: new google.maps.Size(80, 80), // scaled size
      };

      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!',
        icon: icon
      });

      const contentString = 'You Are Here!' ;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      this.updateLoc(pos);
     

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    
    
  }

  updateLoc(pos:any){
    this.authSrv.userDetail().subscribe(res => {
      // console.log(res);
      if(res!==null){
        this.userEmail = res.email;
        this.userID = res.uid;
        
        this.users = this.db.object('/users/' + this.userID).valueChanges().subscribe(data => {
          this.users = data;
          this.imgSrc =  this.users.foto;
          
          const value = {
            fullname: this.users.fullname,
            email: this.users.email,
            foto: this.users.foto,
            lat: pos.lat,
            lng: pos.lng
          };
      
          console.log('users 2 : ', this.users);
          this.userSrv.update( this.userID, value);
          console.log('lanjut');
        });
      }else{
        // this.router.navigateByUrl('/menu');
        this.router.navigateByUrl('/login');
        //this.alertNoUser();
      }

      

    }, err => {
      console.log(err);
    });


    
  }



}
