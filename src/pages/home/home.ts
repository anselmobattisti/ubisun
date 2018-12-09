import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public nome:string=""
  public tempo_maximo:number = 0
  public cords = []
  public uv = []
  public contador = -1
  public estaNoSol:any = ''
  public perigo = false
  public tipo_pele:string = ""
  public dados_sensor:any = ""
  public hora_inicio:any = ""
  public ip_sensor:any = "192.168.0.100"

  constructor(public navCtrl: NavController, public http: HttpClient, private events: Events, private geolocation: Geolocation, private storage: Storage) {}

  calcHomeInicio() {
    if (this.estaNoSol) {
      var event = new Date(this.estaNoSol);
      this.hora_inicio = event.toLocaleTimeString('en-US');
    } else {
      this.hora_inicio = ""
    }
  }

  public getTipoPele() {
    if (this.tipo_pele == '1') {
      return 'Branca'
    }

    if (this.tipo_pele == '2') {
      return 'Morena Clara'
    }

    if (this.tipo_pele == '3') {
      return 'Morena Escura'
    }

    if (this.tipo_pele == '4') {
      return 'Negra'
    }
  }

  isOnSun() {
    if (this.estaNoSol.length == 0) {
      return false
    }
    return true
  }

  public loadData() {
    this.perigo = false

    // Or to get a key/value pair
    this.storage.get('nome').then((val) => {
      this.nome = val
    });

    this.storage.get('tempo_maximo').then((val) => {
      this.tempo_maximo = val
      this.StartTimer()
    });

    this.storage.get('tipo_pele').then((val) => {
      this.tipo_pele = val
    });

    this.storage.get('ip_sensor').then((val) => {
      this.ip_sensor = val
    });

    this.storage.get('estaNoSol').then((val) => {
      this.estaNoSol = val
      this.calcHomeInicio()
    });
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.cords['lat'] = resp.coords.latitude
      this.cords['lng'] = resp.coords.longitude
     }).catch((error) => {
       alert('gps')
       console.log('Error getting location', error);
     });
  }

  StartTimer(){

    let end_date = this.tempo_maximo*60000 + this.estaNoSol - Date.now()
    console.log(end_date)
    if (end_date < 0 && this.estaNoSol) {
      this.perigo = true
    }

    if (this.estaNoSol) {
      setTimeout(() =>
      {
        this.StartTimer()
      }, 1000);
    }
  }

  getDataFromPi() {
    let path = 'http://'+this.ip_sensor+':8000/dados.txt'
    this.http.get(path).subscribe(data => {
      this.dados_sensor = data

      if (this.dados_sensor.lum > 300 ) {
        if (!this.estaNoSol) {
          //console.log('sol')
          this.estaNoSol = Date.now()
          this.calcHomeInicio()
          this.storage.set('estaNoSol', this.estaNoSol)
          var event = new Date(this.estaNoSol);
          this.hora_inicio = event.toLocaleTimeString('en-US');
          this.StartTimer()
        }
      } else {
        //console.log('---')
        this.perigo = false
        this.hora_inicio = ''
        this.estaNoSol = ''
        this.storage.set('estaNoSol', this.estaNoSol)
      }
    });

    setTimeout(() =>
      {
        this.getDataFromPi()
      }, 10000);
  }

  ngOnInit() {

    this.getDataFromPi()
    this.loadData()
    this.StartTimer()

    this.events.subscribe('functionCall:HomeTabSelected', () => {
      this.loadData()
      this.getDataFromPi()
      this.StartTimer()
    });
  }
}
