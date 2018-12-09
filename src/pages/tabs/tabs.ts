import { Component} from '@angular/core';
import { Events } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ConfigPage } from '../config/config';
import { AtivarPage } from '../ativar/ativar';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ConfigPage
  tab5Root = AtivarPage

  constructor(private events: Events) {}

  HomeTabSelected() {
    this.events.publish('functionCall:HomeTabSelected');
  }
}
