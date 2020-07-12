import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeoJson } from '../map';
import * as mapboxgl from 'mapbox-gl';
import { map } from 'rxjs/operators'

export interface MBOutput {
  attribute: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})

export class MBService {

  constructor(private http: HttpClient) { 
    mapboxgl.accessToken = environment.mapbox.accessToken
  }

  searchWord(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=poi&access_token='
    + mapboxgl.accessToken).pipe(map((res: MBOutput) => {
      return res.features;
    }));
  } 

  searchCoords(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=address&access_token='
    + mapboxgl.accessToken).pipe(map((res: MBOutput) => {
      return res.features;
    }));
  } 

  test(query: string) {

  }
}
