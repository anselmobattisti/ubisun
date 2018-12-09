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

  constructor(public navCtrl: NavController, public http: HttpClient, private events: Events, private geolocation: Geolocation, private storage: Storage) {

  }

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
      this.StartTimer(this.tempo_maximo)
    });

    this.storage.get('tipo_pele').then((val) => {
      this.tipo_pele = val
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
       alert(error)
       console.log('Error getting location', error);
     });

     /*
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
        this.cords['lat'] = data.coords.latitude
        this.cords['lng'] = data.coords.longitude
     });
     console.log(this.cords)
     */
  }

  StartTimer(t){
    if (this.estaNoSol != '') {
      setTimeout(x =>
        {

            let end_date = this.tempo_maximo*60000 + this.estaNoSol - Date.now()

            // console.log(end_date)

            if (end_date < 0) {
              this.perigo = true
              // alert('Tempo esgotado procure um safepoint.')
            } else {
              this.StartTimer(t);
            }

        }, 1000);
      }
  }

  getDataFromPi() {
    let path ='http://192.168.0.106:8000/dados.txt'
    this.http.get(path).subscribe(data => {
      this.dados_sensor = data
      //console.debug(data)
    });
  }

  ngOnInit() {

    this.getDataFromPi()
    this.loadData()

    this.events.subscribe('functionCall:HomeTabSelected', () => {
      this.loadData()
      this.getDataFromPi()
    });
  }
}
