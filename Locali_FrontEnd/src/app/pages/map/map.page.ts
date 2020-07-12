import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MBService } from 'src/services/mapbox/mapbox.service';
import { GeoJson, FeatureCollection } from 'src/services/map';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiDjangoService } from 'src/services/api/api-django.service';

class postData {
  geometry:{
    type: string;
    coordinates: number[];
  };
  type: string;
  properties: {
    description: string
  };
}

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})
export class MapPage implements OnInit {

  // default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  allPostData: string;

  constructor(
    private mapboxService: MBService,
    private router: Router,
    public translateService: TranslateService,
    private api: ApiDjangoService
  ) { }

  ngOnInit() {
    this.initializeMap();
    this.map.on('load', () => this.onLoad());
  }

  goHome() {
    this.router.navigate(['/page-main']);
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
    //mapboxgl.accessToken = 'pk.eyJ1IjoicnczMzQtZ3IxNCIsImEiOiJja2FwajhwMzUwYWpyMnBtc3B0ejd2bzF4In0.wStK-14BHHmE1x110lOS_w';
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
      /*const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setHTML('<h1>Hello World!</h1>')
        .addTo(this.map);
      console.log('clicked on map')*/
    })

  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }

  async getPosts() {
    await this.api.refreshToken();
    return new Promise((resolve) => {
      this.api.get('posts/ordered/' + this.lat + '/' + this.lng)
      .subscribe((res) => {
        console.log(res);
        this.allPostData['geometry']['type'] = "Point";
        this.allPostData['geometry']['coordinates'][0] = res['results']['Longitude'];
        this.allPostData['geometry']['coordinates'][1] = res['results']['Latitude'];
        this.allPostData['type'] = "Feature";
        this.allPostData['properties']['description'] = '<a>' + res['results']['body'] + '</a>';
        resolve();
      });
    });
  }

  onLoad() {
    console.log(this.allPostData);
    var json = JSON.parse(this.allPostData);
    this.map.getSource('posts').setData(json);
    this.map.addSource('posts', { type: 'geojson', data: this.allPostData });
    console.log("added source");
    // Add a layer showing the places.
    this.map.addLayer({
      'id': 'posts',
      'type': 'symbol',
      'source': 'posts',
      'layout': {
        'icon-image': 'theatre-15'
      }
    });

    console.log("added layer");

    this.map.on('click', 'places', (event) => {
      const coordinates = event.features[0].geometry.coordinates.slice();
      const description = event.features[0].properties.description;

      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(this.map);

      /*const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setHTML('<h1>Hello World!</h1>')
        .addTo(this.map);
      console.log('clicked on map')*/
    })

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    /*this.map.on('click', 'places', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);

        this.buildMap();
    });*/

    // Change the cursor to a pointer when the mouse is over the places layer.
    //this.map.on('mouseenter', 'places', function() {
    //    this.map.getCanvas().style.cursor = 'pointer';
    //});

    // Change it back to a pointer when it leaves.
    //this.map.on('mouseleave', 'places', function() {
    //  this.map.getCanvas().style.cursor = '';
    //});
  }


}
