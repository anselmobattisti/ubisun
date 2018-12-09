import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  public nome:string = ""
  public tempo_maximo:number = 0
  public tipo_pele:string = ""

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  async salvarConfiguracoes() {

    this.storage.set('nome', this.nome);
    this.storage.set('tempo_maximo', this.tempo_maximo);
    this.storage.set('tipo_pele', this.tipo_pele);

    alert('Dados salvos com sucesso.')
  }

  public loadData() {
    // Or to get a key/value pair
    this.storage.get('nome').then((val) => {
      this.nome = val
    });

    this.storage.get('tempo_maximo').then((val) => {
      this.tempo_maximo = val
    });

    this.storage.get('tipo_pele').then((val) => {
      this.tipo_pele = val
    });
  }

  ngOnInit() {
    this.loadData()
  }
}
