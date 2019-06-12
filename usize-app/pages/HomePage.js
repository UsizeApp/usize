import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Layout from '../components/Layout'
import LottieAnimation from '../components/Utils/LottieAnimation'
import measureAnimation from '../assets/animations/measure'
import Button from '../components/Utils/Button'

export default class AccessPage extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  handlePress = (to) => {
    const { navigation } = this.props
    navigation.push(to)
  }

  render() {
    return (
      <Layout>
        <View style={styles.GlobalContainer}>
          {this.renderAnimation()}
          {this.renderOptions()}
        </View>
      </Layout>
    )
  }

  renderOptions = () => {
    return (
      <View style={styles.OptionsContainer}>
        <Button text="Calcular mis medidas" icon="ios-aperture" to="Scanner" onPress={this.handlePress}/>
        <Button text="Conozco mis medidas" icon="ios-add-circle" to="Home" onPress={this.handlePress}/>
      </View>
    )
  }

  renderAnimation = () => {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LottieAnimation
          height={300}
          width={300}
          animation={measureAnimation}
          animationProps={{ loop: true }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  GlobalContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  OptionsContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})