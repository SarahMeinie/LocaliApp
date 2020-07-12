import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MBService } from 'src/services/mapbox/mapbox.service';
import { GeoJson, FeatureCollection } from 'src/services/map';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MBComponent implements OnInit {

  // default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor(private mapboxService: MBService) { }

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    // get geolocation of user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(postition => {
        this.lat = postition.coords.latitude;
        this.lng = postition.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    // add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      console.log('clicked on map')
    })

    this.map.on('load', (event) => {

    })

    this.map.addLayer({

    })
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }

  

}
