import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import Lottie from "lottie-react";
import * as Icons from "@material-ui/icons";
import Mapbox from "react-mapbox-gl";
import axios from 'axios'
// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import ApexLineChart from "./../charts/components/ApexLineChart";
import Switch from "react-switch";

// animations
import humadity from "./../../animations/humatidy.json";
import temperature from "./../../animations/temperature.json";
import flowerpot from "./../../animations/flowerpot.json";
import sun from "./../../animations/sun.json";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const Map = Mapbox({
  accessToken: "pk.eyJ1IjoiYWxpYWtiYXIxMzc4MTIxMSIsImEiOiJjbDdqNjl2YnUwdjd4M29tbWFtZm8xMDJyIn0.YoQhXZhS3NOapxDcTi0qHQ",
});

export default function Dashboard(props) {
  var classes = useStyles();
  const [backendData, setBackendData] = useState(0)
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const containerStyle = {
    width: '100',
    height: '100%'
  };
  const [series, setSeries] = useState([
    { name: "humidity", data: [] },
    { name: "Temperature", data: [] },
    { name: "Soil moisture", data: [] },
    { name: "Light", data: [] },
  ]);


  const [categories, setCategories] = useState(['a']);
  const [water, setWater] = useState(('0.00.00'))
  const [fan, setFan] = useState(('0.00.00'))
  const [heater, setHeater] = useState(('0.00.00'))
  const [light, setLight] = useState(('0.00.00'))


  function addData(newData) {
    let cats = categories
    cats.push(new Date().toLocaleTimeString())
    const newSeries = series.map((serie) => {
      let nd = serie.data
      nd.push(newData[serie.name])
      if (nd.length > 20) {
        nd.shift();
      }
      return { ...serie, data: nd };
    });
    setCategories(cats.slice(-20));
    setSeries(newSeries);
  }

  function nmeaParser(str) {
    const KNOTS_IN_MS = 1.9438
    const nmea = str.split(',')
    // console.log(nmea)
    function parseLatitude() {
      // console.log(nmea[3])
      // console.log(nmea[4])
      const degrees = Number(nmea[3].substring(0, 2))
      const seconds = Number(nmea[3].substring(2))
      const negate = nmea[4].toUpperCase() == 'S'
      return (degrees + seconds / 60) * (negate ? -1 : 1)
    }
    function parseLongitude() {
      //console.log(nmea[5])
      //console.log(nmea[6])
      const degrees = Number(nmea[5].substring(0, 3))
      const seconds = Number(nmea[5].substring(3))
      const negate = nmea[6].toUpperCase() == 'W'
      return (degrees + seconds / 60) * (negate ? -1 : 1)
    }
    return {
      lat: parseLatitude(),
      lng: parseLongitude()
    }
  }
  const sendData = (action) => {
    let data = JSON.stringify({
      "action": action
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/action/?sensor_id='+slave_id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });

  }



  useEffect(() => {
    let data = ''
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/dashboard?sensor_id='+slave_id,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: data
    };

    const intervalId = setInterval(() => {

      axios.request(config)
        .then((response) => {
          if (response.data.status == 200) {
            setBackendData(response.data.data.data)
            console.log(response.data.data.data)
            var l1 = 0
            l1 = nmeaParser("$GPGGA,123519,A," + response.data.data.data.la + "," + response.data.data.data.sn + "," + response.data.data.data.lo + "," + response.data.data.data.ew + ",022.4,084.4,230394,003.1,W*6A")

            setLat(l1.lat)
            setLong(l1.lng)
            const newData = {
              humidity: response.data.data.data.humidityValue,
              Temperature: response.data.data.data.tempValue,
              "Soil moisture": response.data.data.data.soilMoistureValue,
              Light: response.data.data.data.lightValue,
            };
            addData(newData);
            setFan(response.data.data.fan)
            setHeater(response.data.data.heater)
            setLight(response.data.data.light)
            setWater(response.data.data.water)
          }
        })
        .catch((error) => {
          console.log(error);
        });


    }, 1000); // Send request every 1000 milliseconds (1 second)

    return () => clearInterval(intervalId);
  }, []);
  let slave_id = localStorage.getItem('slave_id')
  console.log(slave_id)
  return (
    <>
      {slave_id == undefined ?
         <PageTitle title="Dashboard " />: <PageTitle title={"Dashboard board id   :"+slave_id} />
      }
      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title=" humidity"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            disableWidgetMenu
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>

                  <Typography size="xxl" weight="medium" noWrap >
                    {backendData.humidityValue}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Lottie animationData={humadity} loop={true} />
                </Grid>
              </Grid>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"

            >
              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  last fan On
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Typography color="text" colorBrightness="secondary" noWrap style={{ paddingRight: 10 }}>
                    {fan == undefined ? "" : fan}

                  </Typography>

                  <Icons.AccessTime />

                </div>

              </Grid>

              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  Turn on Fan
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Switch size="small" onChange={e => { e ? sendData('fan on') : sendData('fan off') }} checked={backendData.fanVal == 1 ? true : false} />

                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            disableWidgetMenu
            title="Temperature"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography size="xxl" weight="medium" noWrap>
                    {backendData.tempValue} °C
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Lottie animationData={temperature} loop={true} />
                </Grid>
              </Grid>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"

            >
              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  last heater On
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Typography color="text" colorBrightness="secondary" noWrap style={{ paddingRight: 10 }}>
                    {heater == undefined ? "" : heater}

                  </Typography>

                  <Icons.AccessTime />

                </div>

              </Grid>

              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  Turn on heater
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Switch size="small" onChange={e => { e ? sendData('heater on') : sendData('heater off') }} checked={backendData.heaterVal == 1 ? true : false} />

                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            disableWidgetMenu
            title="Soil moisture"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography size="xxl" weight="medium" noWrap>
                    {backendData.soilMoistureValue} %

                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Lottie animationData={flowerpot} loop={true} />

                </Grid>
              </Grid>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"

            >
              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  last water pump On
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Typography color="text" colorBrightness="secondary" noWrap style={{ paddingRight: 10 }}>

                    {water == undefined ? "" : water}

                  </Typography>

                  <Icons.AccessTime />

                </div>

              </Grid>

              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  Turn on water pump
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Switch size="small" onChange={e => { e ? sendData('water on') : sendData('water off') }} checked={backendData.waterPumpVal == 1 ? true : false} />

                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>



        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            disableWidgetMenu
            title="Light"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography size="xxl" weight="medium" noWrap>
                    {backendData.lightValue} %
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Lottie animationData={sun} loop={true} />

                </Grid>
              </Grid>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"

            >
              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  last light  On
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Typography color="text" colorBrightness="secondary" noWrap style={{ paddingRight: 10 }}>
                    {/* {light ==undefined :''?''} */}
                    {light == undefined ? "" : light}

                  </Typography>

                  <Icons.AccessTime />

                </div>

              </Grid>

              <Grid item xs={6}>
                <Typography color="text" colorBrightness="secondary" noWrap>
                  Turn on light
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  <Switch size="small" onChange={e => { e ? sendData('light on') : sendData('light off') }} checked={backendData.lightVal == 1 ? true : false} />

                </div>

              </Grid>

            </Grid>
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Widget title="Apex Line Chart" upperTitle noBodyPadding disableWidgetMenu>
            <ApexLineChart series={series} categories={categories} />
          </Widget>
        </Grid>


        <Grid item xs={12}>
          <Widget title="Map" upperTitle noBodyPadding disableWidgetMenu>
            <div className={classes.mapContainer}>
              <LoadScript
                googleMapsApiKey="AIzaSyDp1ZiVY7cxsmnzYXGaGiecQmq7o8j_bp0"
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{
                    lat: lat,
                    lng: long
                  }}
                  // defaulCenter={{'49.83495683333334', '97.15359133333334'}}
                  zoom={10}
                >
                  {/* <LocationPin
                    lat={location.lat}
                    lng={location.lng}
                    text={location.address}
                  /> */}

                  <MarkerF key="marker_1"
                    position={{
                      lat: lat,
                      lng: long
                    }}
                  />

                </GoogleMap>
              </LoadScript>
            </div>
          </Widget>
        </Grid>




      </Grid>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}
