import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Scanner from 'components/Scanner';
import styles from '../../styles/styles';

export default class Foto extends Component {
  static navigationOptions = {
    title: 'Paso 1/2: Foto frontal',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  camera = null;

  constructor(props) {
    super(props);
    this.state = {
      captures: [],
      capturing: null,
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
    };
  }

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    // const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    // const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');
    const hasCameraPermission = (camera.status === 'granted');
    this.setState({ hasCameraPermission });
  }

  /*
  onContinueHandler = () => {
    // const { navigation } = this.props
    // navigation.push('Measure')
  }
  */

  setFlashMode = (flashMode) => this.setState({ flashMode });

  setCameraType = (cameraType) => this.setState({ cameraType });

  handleCaptureIn = () => this.setState({ capturing: true });

  handleCaptureOut = () => {
    const { capturing } = this.state;
    if (capturing) {
      this.camera.stopRecording();
    }
  };

  handleShortCapture = async () => {
    await this.camera.takePictureAsync()
      .then((frontalPhotoData) => {
        this.setState({ capturing: false });
        const { navigation } = this.props;
        navigation.navigate('FotoLateral', {
          frontal: frontalPhotoData,
          height: navigation.state.params.height,
        });
      })
      .catch((err) => console.error(err));
  };

  handleLongCapture = async () => {
    const videoData = await this.camera.recordAsync();
    this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
  };


  render() {
    const {
      hasCameraPermission, flashMode, cameraType, capturing, captures,
    } = this.state;

    if (hasCameraPermission) {
      return (
        <>
          <View>
            <Camera
              type={cameraType}
              flashMode={flashMode}
              ratio="16:9"
              style={styles.preview}
              ref={(camera) => { this.camera = camera; }}
            />
          </View>
          {/* captures.length === 2 ? <Scanner.Continue onPress={this.onContinueHandler} /> : (
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
          ) */}
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
        </>
      );
    }

    if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    return <View />;
  }
}
