import React, { Component } from 'react';
import ReactMapGL, { Marker, Layer, Feature } from 'react-map-gl';
import Geocoder from 'react-geocoder-autocomplete';
import Cookies from 'js-cookie';
import { polygon, point, pointsWithinPolygon } from '@turf/turf';

const TOKEN =
  'pk.eyJ1IjoidGhlbzMzMyIsImEiOiJjazIxemM0YWoxcDgxM21waXNpcHZwdTRhIn0.tKoVFIxyUkxchHPJIFM5hw';

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: '100%vw',
        height: '800',
        latitude: 40.8510998,
        longitude: -74.0873832,
        zoom: 11,
      },
      storeLocation: [-74.085076, 40.850979], // [long, lat]
      currentSearch: null,
      searches: Cookies.getJSON('searches') || [],
      TOKEN,
    };

    this.onSelect = this.onSelect.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.deleteSearchItem = this.deleteSearchItem.bind(this);
  }

  onSelect(currentSearch) {
    console.log('currentSearch: ', currentSearch);
    const { searches } = this.state;
    this.setState(
      {
        currentSearch,
        searches: [...searches, currentSearch],
      },
      () => {
        Cookies.set('searches', this.state.searches);
        console.log('searches after select new one: ', this.state.searches);
        console.log('state after select new one: ', this.state);
      },
    );
  }

  onInputChange(value) {
    console.log('input change: ', value);
  }

  deleteSearchItem(itemId) {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newSearches = this.state.searches.filter(search => search.id !== itemId);
    this.setState(
      {
        searches: newSearches,
      },
      () => {
        Cookies.set('searches', this.state.searches);
        console.log('search list after delete: ', this.state.searches);
      },
    );
  }

  isInDeliveryZone(currentSearchCoordinates) {
    // coordinate data comes from studio.mapbox.com account
    const deliveryZoneOuter = polygon([
      [
        [-74.16237200261365, 40.89342416767394],
        [-74.18537281000276, 40.85374706633121],
        [-74.152309149392, 40.80080727373374],
        [-74.08115040153235, 40.78629584751016],
        [-74.0322736858356, 40.82274977948828],
        [-74.00831451146911, 40.866250633673076],
        [-74.0236483830664, 40.903928276891406],
        [-74.07803570886267, 40.92547458939251],
        [-74.1314646676952, 40.9225780148017],
        [-74.16237200261365, 40.89342416767394],
      ],
    ]);

    const deliveryZoneInner = polygon([
      [
        [-74.087712, 40.903354],
        [-74.121511, 40.901139],
        [-74.146308, 40.876564],
        [-74.155649, 40.853173],
        [-74.136698, 40.823936],
        [-74.066373, 40.817793],
        [-74.042281, 40.837057],
        [-74.02902, 40.866035],
        [-74.041298, 40.893515],
        [-74.087712, 40.903354],
      ],
    ]);

    const clientLocation = point(currentSearchCoordinates);
    const inOuterDeliveryZone = pointsWithinPolygon(clientLocation, deliveryZoneOuter).features
      .length;
    const inInnerDeliveryZone = pointsWithinPolygon(clientLocation, deliveryZoneInner).features
      .length;

    // in inner delivery zone
    if (inOuterDeliveryZone && inInnerDeliveryZone) {
      return 3;
    }
    // in outer delivery zone
    if (inOuterDeliveryZone) {
      return 5;
    }
    // outside of deliver zone
    return 0;
  }

  render() {
    const { storeLocation, searches, TOKEN } = this.state;

    return (
      <div className="row">
        <section id="info-section" className="col-md-4">
          <article>
            <h2 className="text-center">Instructions</h2>
            <p>test</p>
          </article>
          <article>
            <h2 className="text-center">Searches</h2>
            <ul className="list-group">
              {/* eslint-disable */}
              {searches
                ? searches.map((search, idx) => {
                    {
                      console.log('search', search);
                    }
                    return (
                      <li key={search.id} className="list-group-item">
                        <span className="search-idx">{idx + 1} :</span>
                        {search.place_name}
                        {this.isInDeliveryZone(search.center)
                          ? this.isInDeliveryZone(search.center)
                          : 0}
                        <button onClick={() => this.deleteSearchItem(search.id)}>X</button>
                      </li>
                    );
                  })
                : ''}
              {/* eslint-enable */}
            </ul>
          </article>
        </section>
        <section id="map-section" className="col-md-8">
          <ReactMapGL
            {...this.state.viewport}
            onViewportChange={viewport => this.setState({ viewport })}
            mapStyle="mapbox://styles/theo333/cjvspb9dj1ma81cs3lsp05mdz" // get from MapBox Studio
            mapboxApiAccessToken={TOKEN}
          >
            <Geocoder
              accessToken={TOKEN}
              onSelect={this.onSelect}
              showLoader={false}
              onInputChange={this.onInputChange}
              proximity="-74.085076,40.850979"
              // bbox - limits search results to this area
              bbox="-74.26110921823805,40.7991913964384,-73.97434436728172,40.9622544817727"
            />
            <Marker longitude={storeLocation[0]} latitude={storeLocation[1]}>
              <i className="fas fa-heart" />
            </Marker>
            {searches &&
              searches.map((search, idx) => {
                return (
                  <Marker key={search.id} longitude={search.center[0]} latitude={search.center[1]}>
                    <button type="button" className="btn-pin" title={search.place_name}>
                      {idx + 1}
                    </button>
                    <i className="fas fa-map-pin" />
                  </Marker>
                );
              })}
          </ReactMapGL>
        </section>
      </div>
    );
  }
}
