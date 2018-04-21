import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalvarsService} from '../services/globalvars.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private global: GlobalvarsService) { }

  address = "";
  address_search;

  address_payload;
  address_type;
  address_events;

  recent_events = {};
  recent_agreements = {};

  ngOnInit() {
    this.global.globalvars.current_component = "explorer";
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.address = params['id'];
        this.api.serverRequest({id: this.address}, "FETCH_ADDRESS"). then(data => {
          if (data["address_type"] != null) {
            this.address_type = data["address_type"];
            this.address_payload = data["payload"];
            if (data["address_type"] == 'AGREEMENT') {
              this.api.serverRequest({id: this.address}, "FETCH_ADDRESS_EVENTS"). then(data => this.address_events = data);
            }
          }
          else {
            this.address_type = "UNDEFINED";
            this.address_payload = null;
          }
        });
      }
      else {
        this.address = null;
        this.api.serverRequest({}, "FETCH_RECENT_EVENTS").then(data => this.recent_events = data);
        this.api.serverRequest({}, "FETCH_RECENT_AGREEMENTS").then(data => this.recent_agreements = data);
      }
    });
  }

  explore_address = function (address) {
    this.router.navigate(['explorer', address]);
  }
}