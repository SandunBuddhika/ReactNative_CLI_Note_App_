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
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProfileUi({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Employee', value: '1' },
    { label: 'Student', value: '2' },
  ]);
  const [getMobileNo, setMobileNo] = useState('');
  const [getPassword, setPassword] = useState('');
  const [getFirstName, setFirstName] = useState('');
  const [getLastName, setLastName] = useState('');
  const [getPasswordIcon, setPasswordIcon] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadUserTypes();
      isLog();
      loadUserDetails();
    });
  });

  const ui = (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar hidden={true} /> */}
      <View style={styles.view1}>
        <Image source={require("./asset/img/profileIcon.png")} style={styles.img1} />
      </View>
      <View style={styles.view2}>
        <View style={styles.superInputView}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/nameIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput placeholder='First Name' onChangeText={text => setFirstName(text)} value={getFirstName} editable={false} />
          </View>
        </View>
        <View style={styles.superInputView2}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/nameIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput placeholder='Last Name' onChangeText={text => setLastName(text)} value={getLastName} editable={false} />
          </View>
        </View>
        <View style={styles.superInputView2}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/mobileNoIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput keyboardType='number-pad' onChangeText={text => setMobileNo(text)} value={getMobileNo} placeholder='Mobile Number' editable={false} />
          </View>
        </View>
        <View style={styles.superInputView2}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/passwordIcon.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <TextInput secureTextEntry={getPasswordIcon} onChangeText={text => setPassword(text)} value={getPassword} placeholder='Password' editable={false} />
          </View>
          <View style={styles.inputView1}>
            <Pressable onPress={changePasswordIcon}>
              {getPasswordIcon === true ? <Image source={require('./asset/img/passwordView.png')} style={styles.inputIcons} /> : <Image source={require('./asset/img/passwordHide.png')} style={styles.inputIcons} />}
            </Pressable>
          </View>
        </View>
        <View style={styles.superInputView2}>
          <View style={styles.inputView1}>
            <Image source={require('./asset/img/userType.png')} style={styles.inputIcons} />
          </View>
          <View style={styles.inputView2}>
            <DropDownPicker
              items={items}
              open={open}
              value={value}
              setValue={setValue}
              setOpen={setOpen}
              setItems={setItems}
              placeholder='Select'
              style={styles.dropDown}
              disabled={true}
            />
          </View>
        </View>
      </View>
      <View style={styles.view3}>
        <Pressable onPress={toLogOut}>
          <Text style={styles.btn1}>Log Out</Text>
        </Pressable>
      </View>
      <View style={styles.view4}>
        <View style={styles.navigationBarView1}>
          <Pressable onPress={() => navigation.navigate("CreateNote", { isUpdate: false })}>
            <Image source={require('./asset/img/CreateNoteIcon2.png')} style={styles.navigationBarIcon1} />
          </Pressable>
        </View>
        <View style={styles.navigationBarView2}>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Image source={require('./asset/img/HomeIcon.png')} style={styles.navigationBarIcon1} />
          </Pressable>
        </View>
        {/* <View style={styles.navigationBarView3}>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image source={require('./asset/img/profileIcon.png')} style={styles.navigationBarIcon3} />
          </Pressable>
        </View> */}
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

  async function loadUserDetails() {
    let m = await AsyncStorage.getItem('mobile');
    const data = {
      mobile: m,
    }
    fetch('http://10.0.2.2/NoteApp/getUserDetails.php', {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data)
    }).
      then(response => response.json()).
      then(json => {
        if (json['response'] === 'Success') {
          setFirstName(json["fName"]);
          setLastName(json["lName"]);
          setMobileNo(json["mobile"]);
          setPassword(json["password"]);
          setValue(json["type"]);
        } else {
          Alert.alert("Error", json['response'])
        }
      }).catch(error => Alert.alert("Error", error));
  }

  async function toLogOut() {
    await AsyncStorage.removeItem('mobile');
    await AsyncStorage.removeItem('password');
    isLog();
  }


  function loadUserTypes() {
    fetch('http://10.0.2.2/NoteApp/getUserType.php', {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
      },
    }).
      then(response => response.json()).
      then(json => {
        setItems(json);
      }).catch(error => Alert.alert("Error", error));
  }
  async function isLog() {
    let m = await AsyncStorage.getItem('mobile');
    let p = await AsyncStorage.getItem('password');
    if (m == null && p == null) {
      navigation.navigate("SignIn");
    }
  }

}

const styles = StyleSheet.create({

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
    flex: 10,
  },
  view3: {
    flex: 4,
    alignItems: "center",
  },
  view4: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: "white"
  },
  btn1: {
    backgroundColor: "#009dff",
    textAlign: 'center',
    textAlignVertical: "center",
    height: 45,
    width: 200,
    borderRadius: 10,
    color: "white",
    fontWeight: 'bold',
    marginTop: 45,
  },
  registerText: {
    marginTop: 20,
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
    justifyContent: 'center',
  },
  superInputView: {
    height: 49,
    flexDirection: 'row',
    marginTop: 40,
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
    // overflow: 'hidden',
  },
  NoteTypeIcon1: {
    height: 35,
    width: 35,
    objectFit: 'contain'
  },
  inputIcons: {
    height: 25,
    width: 25,
    objectFit: 'contain',
  },
  dropDown: {
    borderWidth: 0,
  },
  navigationBarView1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBarView2: {
    flex: 1,
    // backgroundColor: "blue",
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBarView3: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBarIcon1: {
    height: 35,
    width: 35,
    objectFit: "contain"
  },
  navigationBarIcon3: {
    height: 30,
    width: 30,
    objectFit: "contain"
  },
});