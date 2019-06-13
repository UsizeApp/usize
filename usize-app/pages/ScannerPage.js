import React from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import styles from '../styles/styles';
import Scanner from '../components/Scanner'

export default class ScannerPage extends React.Component {
	camera = null;

	state = {
		captures: [],
		capturing: null,
		hasCameraPermission: null,
		cameraType: Camera.Constants.Type.back,
		flashMode: Camera.Constants.FlashMode.off,
	};

	onContinueHandler = () => {
		const { navigation } = this.props
		navigation.push('Measure')
	}

	setFlashMode = (flashMode) => this.setState({ flashMode });
	setCameraType = (cameraType) => this.setState({ cameraType });
	handleCaptureIn = () => this.setState({ capturing: true });

	handleCaptureOut = () => {
		if (this.state.capturing)
			this.camera.stopRecording();
	};

	handleShortCapture = async () => {
		const photoData = await this.camera.takePictureAsync();
		this.setState({ capturing: false })

		var uri = photoData.uri;
		//var serverURL = "http://10.0.0.22:3333/upload"
		var serverURL = "http://192.168.0.5:3333/upload"

		var photo = {
			uri: uri,
			type: 'image/jpeg',
			name: 'photo.jpg',
		};

		var height = 174

		var body = new FormData();
		body.append('photo', photo);
		body.append('height', height);
		body.append('authToken', 'secret');

		var xhr = new XMLHttpRequest();
		xhr.open('POST', serverURL);

		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var JSON_mode = 1
					if (JSON_mode == 1) {
						// Obtengo la respuesta de la API
						var json_res = JSON.parse(xhr.responseText);
						//console.log(json_res);
						var alert_left = "-1";
						var alert_right = "-1";
						// Itero sobre los elementos del JSON de la respuesta
						JSON.parse(xhr.responseText, function (k, v) {
							//console.log(k);
							//console.log(v);
							if (k == "left")
								alert_left = v;
							if (k == "right")
								alert_right = v;
						});
						// Genero una alerta en la app
						var myAlert = "Brazo izquierdo: " + alert_left + "\nBrazo derecho: " + alert_right;
						console.log(myAlert);

						if (Alert)
							Alert.alert("Resultados", myAlert);
						else
							alert(myAlert);
					}
					else {
						var response = xhr.responseText;
						var json_res2 = response.json()
						console.log(json_res2)
					}
				} else {
					console.error(xhr.statusText);
				}
			}
		}.bind(this);

		xhr.onerror = function (e) {
			console.error(xhr.statusText);
		};

		xhr.send(body);
	};

	handleLongCapture = async () => {
		const videoData = await this.camera.recordAsync();
		this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
	};

	async componentDidMount() {
		const camera = await Permissions.askAsync(Permissions.CAMERA);
		const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');
		this.setState({ hasCameraPermission });
	};

	render() {
		const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>Access to camera has been denied.</Text>;
		}

		return (
			<React.Fragment>
				<View>
					<Camera
						type={cameraType}
						flashMode={flashMode}
						ratio={'16:9'}
						style={styles.preview}
						ref={camera => this.camera = camera}
					/>
				</View>

				{captures.length === 2 ? <Scanner.Continue onPress={this.onContinueHandler} /> :
					<Scanner.Toolbar
						capturing={capturing}
						flashMode={flashMode}
						cameraType={cameraType}
						setFlashMode={this.setFlashMode}
						setCameraType={this.setCameraType}
						onCaptureIn={this.handleCaptureIn}
						onCaptureOut={this.handleCaptureOut}
						onLongCapture={this.handleLongCapture}
						onShortCapture={this.handleShortCapture}
					/>
				}
			</React.Fragment>
		);
	};
};