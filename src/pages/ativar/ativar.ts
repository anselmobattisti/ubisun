import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AtivarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ativar',
  templateUrl: 'ativar.html',
})
export class AtivarPage {

  public estaNoSol:any = ''
  public hora_inicio:any = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  calcHomeInicio() {
    var event = new Date(this.estaNoSol);
    this.hora_inicio = event.toLocaleTimeString('en-US');
  }

  fuiProSol() {
    this.estaNoSol = Date.now()
    this.calcHomeInicio()
    this.storage.set('estaNoSol', this.estaNoSol)
  }

  saiDoSol() {
    this.hora_inicio = ''
    this.estaNoSol = ''
    this.storage.set('estaNoSol', this.estaNoSol)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AtivarPage');
  }

}
