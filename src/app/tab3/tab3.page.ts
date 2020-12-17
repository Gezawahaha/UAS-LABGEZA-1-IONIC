import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/app/services/users';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { Http } from '@angular/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  users: any;
  userNow: boolean = false;
  userID: string;
  imgSrc:string;
  imgURL: string;
  userEmail: string;
  foto: string;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private userSrv: UserService,
    private db: AngularFireDatabase,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private http: Http
  ) { }

  ngOnInit() {
    // this.authSrv.userDetail().subscribe(res => {
    //   console.log(res);
    //   if(res!==null){
    //     this.userEmail = res.email;
    //     this.userID = res.uid;
    //     this.userNow = true;
    //     console.log(this.userID);
    //     this.users = this.db.object('/users/' + this.userID).valueChanges().subscribe(data => {
    //       this.users = data;
    //       console.log('users : ', this.users);
    //     });
    //   }else{
    //     // this.router.navigateByUrl('/menu');
    //     this.userNow = false;
    //     this.alertNoUser();
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }

  ionViewDidEnter(){
    this.authSrv.userDetail().subscribe(res => {
      // console.log(res);
      if(res!==null){
        this.userEmail = res.email;
        this.userID = res.uid;
        this.userNow = true;
        this.users = this.db.object('/users/' + this.userID).valueChanges().subscribe(data => {
          this.users = data;
          this.imgSrc =  this.users.foto;
          console.log('users : ', this.users);
        });
      }else{
        // this.router.navigateByUrl('/menu');
        this.userNow = false;
        this.router.navigateByUrl('/login');
        //this.alertNoUser();
      }
    }, err => {
      console.log(err);
    });
  }

  async alertNoUser(){
    const alert = await this.alertCtrl.create({
      header: 'Hello!',
      message: 'You are not signed in!',
      buttons: [
        
        {
          text: 'Sign In',
          handler: () => this.gotoSignInPage()
        }
      ]
    });
    await alert.present();
  }

  gotoSignInPage(){
    this.router.navigateByUrl('/login');
  }

  logoutUser(){
    this.authSrv.logoutUser()
      .then(res => {
        console.log(res);
        this.router.navigateByUrl('/login');
      }).catch(error => {
        console.log(error);
      });
    
    this.userNow = false;
  }

  fileChanged(event){
    const files = event.target.files;
    console.log(files);

    const data = new FormData();
    data.append('file', files[0]);
		data.append('UPLOADCARE_STORE', '1');
		data.append('UPLOADCARE_PUB_KEY', '47a89c8fa1405e7504de');

    this.http.post('https://upload.uploadcare.com/base/', data )
    .subscribe(event => {
      console.log(event);
      this.imgSrc = event.json().file;
      this.imgURL = ('https://ucarecdn.com/'+ this.imgSrc + '/');
      const value = {
        fullname: this.users.fullname,
        email: this.users.email,
        foto: this.imgURL,
        lat: this.users.lat,
        lng: this.users.lng
      };
      this.userSrv.update(this.userID, value);
      console.log('masok',this.userID,this.imgURL);

    });
    
  }
}
