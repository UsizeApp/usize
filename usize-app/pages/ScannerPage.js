import React from 'react';
import { View, Text, Linking } from 'react-native';
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
		var serverURL = "http://192.168.0.5:3333/login"

		var photo = {
			uri: uri,
			type: 'image/jpeg',
			name: 'photo.jpg',
		};
		var height = 174
		var body = new FormData();
		body.append('authToken', 'secret');
		body.append('photo', photo);
		body.append('height', height);
		body.append('title', 'A beautiful photo!');

		var xhr = new XMLHttpRequest();
		xhr.open('POST', serverURL);
		xhr.send(body);

		var data = {
			"username": "b",
		}

		/*
		fetch(serverURL, {
			method: "POST",
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then(function (response) {
				console.log(response)
				return response.json();
			})
			.then(function (data) {
				console.log(data)
			});

		*/
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

				{captures.length === 2 ? <Scanner.Continue onPress={this.onContinueHandler}/> :
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