import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Pressable,
  Image,
  StatusBar
} from 'react-native';

export function SignInUi({ navigation }) {
  const [getPasswordIcon, setPasswordIcon] = useState(true);
  const [getMobileNo, setMobileNo] = useState('');
  const [getPassword, setPassword] = useState('');

  useEffect(() => {
    navigation.addListener('focus', () => {
      isLog();
    });
  });

  const ui = (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar hidden={true} /> */}
      <View style={styles.view1}>
        <Image source={require("./asset/img/AuthPageIcon.png")} style={styles.img1} />
      </View>
      <View style={styles.view2}>
        <View style={styles.superInputView}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/mobileNoIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput keyboardType='number-pad' style={styles.font1} onChangeText={text => setMobileNo(text)} placeholder='Mobile Number' />
          </View>
        </View>
        <View style={styles.superInputView2}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/passwordIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput secureTextEntry={getPasswordIcon}  style={styles.font1} onChangeText={text => setPassword(text)} placeholder='Password' />
          </View>
          <View style={styles.inputView1}>
            <Pressable onPress={changePasswordIcon}>
              {getPasswordIcon === true ? <Image source={require('./asset/img/passwordView.png')} style={styles.inputIcons} /> : <Image source={require('./asset/img/passwordHide.png')} style={styles.inputIcons} />}
            </Pressable>
          </View>
        </View>
        <Text style={styles.forgottedText}>forgotted password?</Text>
      </View>
      <View style={styles.view3}>
        <Pressable onPress={signInProcess}>
          <Text style={styles.btn1}>Sign In</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text style={styles.registerText}>If Your Don't Have a Account
            <Text style={{ color: "#009dff", fontWeight: 'bold' }}> Create New Account</Text> {/*  have to put a pressable in here to navigate to the registation page */}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
  return ui;

  function changePasswordIcon() {
    if (getPasswordIcon === true) {
      setPasswordIcon(false);
    } else {
      setPasswordIcon(true);
    }
  }
  function toSignUp() {
    navigation.navigate("SignUp");
  }


  function signInProcess() {
    const data = {
      mobile: getMobileNo,
      password: getPassword,
    }

    fetch('http://10.0.2.2/NoteApp/signInProcess.php', {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).
      then(json => {
        if (json['response'] === 'Success') {
          AsyncStorage.setItem("mobile", data["mobile"]);
          AsyncStorage.setItem("password", data["password"]);
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", json['response'])
        }
      }).
      catch(error => Alert.alert("Error", error));
  }
  async function isLog() {
    let m = await AsyncStorage.getItem('mobile');
    let p = await AsyncStorage.getItem('password');
    if (m !== null && p !== null) {
      navigation.navigate("Home");
    }
  }
}

const styles = StyleSheet.create({
  font1:{
    fontFamily:"Outfit-Light"
  },
  font2:{
    fontFamily:"Outfit-Regular"
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  view1: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view2: {
    flex: 6,
  },
  view3: {
    flex: 5,
    alignItems: "center"
  },
  btn1: {
    fontFamily:"Outfit-Light",
    backgroundColor: "#009dff",
    textAlign: 'center',
    textAlignVertical: "center",
    height: 45,
    width: 200,
    borderRadius: 10,
    color: "white",
    fontWeight: 'bold',
    marginTop: 10,
  },
  registerText: {
    fontFamily:"Outfit-Light",
    marginTop: 100,
  },
  img1: {
    marginTop: 100,
    width: 400,
    height: 100,
    objectFit: 'contain'
  },
  inputView2: {
    flex: 6,
  },
  inputView1: {
    flex: 1,
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  superInputView: {
    height: 49,
    flexDirection: 'row',
    marginTop: 80,
    marginHorizontal: 40,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: 'hidden',
  },
  superInputView2: {
    height: 49,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 40,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputIcons: {
    height: 25,
    width: 25,
    objectFit: 'contain',
  },
  forgottedText: {
    fontFamily:"Outfit-Light",
    marginLeft: 40,
    marginTop: 10,
    color: '#009dff',
    fontWeight: '400',
    fontSize: 11,
  },
});