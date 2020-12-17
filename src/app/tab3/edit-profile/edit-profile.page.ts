import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/app/services/users';
import { UserService } from 'src/app/services/user.service';
import { finalize, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  users: any;
  userID: string;
  userEmail: string;

  profile: Observable<any>;

  imgSrc: string;
  selectedImage: any = null;
  imgDB: string;
  imgUrl: string;
  boolImg: number;
  
  @ViewChild('f', null) f: NgForm;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private userSrv: UserService,
    private db: AngularFireStorage,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
      this.boolImg = 0;
      this.authSrv.userDetail().subscribe(res => {
        console.log(res);
        console.log('uid: ', res.uid);
        if(res !== null){
          this.userEmail =  res.email;
          this.userID = res.uid;
          this.userSrv.getUsers(this.userID).subscribe(profile => {
            this.users = profile;
            this.imgSrc =  this.users.foto;
            console.log(this.imgSrc);
          });
          // setTimeout( () => {
          //   this.f.setValue(this.users);
          // })
        }
        else {
          this.navCtrl.navigateBack('/login');
        }
      }, err => {
        console.log(err);
      });
    }
    onSubmit(form: NgForm){
      console.log(form);
  
      if(this.boolImg == 1) {
        var filePath = 'users/foto/'+ this.userID;
      
        const fileRef = this.db.ref(filePath);
        this.db.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.imgUrl = url;
              console.log(url);
              
              })
          })
        ).subscribe();
      } else {
        this.imgUrl = this.imgSrc;
      }
      form.value['foto'] = this.imgUrl;
  
      this.userSrv.update(this.userID, form.value).then(res => {
        this.router.navigateByUrl('/tabs/tab3');
      }).catch(error => console.log(error));
  
      form.reset();
      this.router.navigateByUrl('/tabs/tab3');
    }
    changeListener(event: any) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imgSrc = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.selectedImage = event.target.files[0];
      }
      else {
        this.imgSrc = this.imgDB;
        this.selectedImage = null;
      }
      this.boolImg = 1;
    }
  }
    
  

  









  // ionViewDidEnter(){
  //   this.authSrv.userDetail().subscribe(res => {
  //     // console.log(res);
  //     if(res!==null){
  //       this.userEmail = res.email;
  //       this.userID = res.uid;
  //       this.userNow = true;
  //       this.users = this.db.object('/users/' + this.userID).valueChanges().subscribe(data => {
  //         this.users = data;
  //         console.log('users : ', this.users);
  //       });
  //     }
  //   }, err => {
  //     console.log(err);
  //   });
  // }
// }
