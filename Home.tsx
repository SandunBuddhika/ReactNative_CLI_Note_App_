import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';

export function HomeUi({ navigation }) {
  const data = [];

  const [getData, setData] = useState([]);
  const [getSearchBar, setSearchBar] = useState<StyleProp<ViewStyle>>(styles.searchViewDisplayNone);
  const [getNoteTitile, setNoteTitile] = useState("");

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadNotes();
      isLog();
    });
  });

  const ui = (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar hidden={true}/> */}
      <View style={styles.view1}>
        <View style={styles.titleView1}>
          <Pressable onPress={searchBarState}>
            <Text style={styles.titleText}>NoteApp</Text>
          </Pressable>
        </View>
        <View style={styles.titleView2}>
          <Pressable onPress={searchBarState}>
            <Image source={require('./asset/img/searchIcon.png')} style={styles.searchIcon} />
          </Pressable>
        </View>
      </View>
      <View style={styles.view2}>
        <View style={getSearchBar}>
          <TextInput placeholder="Search" onChangeText={text=>searchNote(text)}  />
        </View>
        <FlatList data={getData} renderItem={itemUi}></FlatList>
      </View>
      <View style={styles.view3}>
        <View style={styles.navigationBarView1}>
          <Pressable onPress={() => navigation.navigate("CreateNote", { isUpdate: false })}>
            <Image source={require('./asset/img/CreateNoteIcon2.png')} style={styles.navigationBarIcon1} />
          </Pressable>
        </View>
        <View style={styles.navigationBarView2}>
          <Pressable onPress={() => loadNotes()}>
            <Image source={require('./asset/img/HomeIcon.png')} style={styles.navigationBarIcon1} />
          </Pressable>
        </View>
        <View style={styles.navigationBarView3}>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image source={require('./asset/img/profileIcon.png')} style={styles.navigationBarIcon3} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
  return ui;

  async function loadNotes() {
    const mobile = await AsyncStorage.getItem("mobile");
    const data = {
      "mobile": mobile,
    }
    fetch('http://10.0.2.2/NoteApp/getUserNotes.php', {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data)
    }).
      then(response => response.json()).
      then(json => {
        for (let type of json) {
          switch (type["icon"]) {
            case 1:
              type["icon"] = require("./asset/img/workIcon.png");
              break;
            case 2:
              type["icon"] = require("./asset/img/studyIcon.png");
              break;
            case 3:
              type["icon"] = require("./asset/img/plansIcon.png");
              break;
            default:
              type["icon"] = require("./asset/img/personalIcon.png");
          }
        }
        setData(json);
      }).catch(error => Alert.alert("Error", error));
  }

  function searchBarState() {
    if (getSearchBar === styles.searchViewDisplayNone) {
      setSearchBar(styles.searchViewDisplay);
    } else {
      setSearchBar(styles.searchViewDisplayNone);
    }
  }

  function itemUi({ item }) {
    const ui = (
      <Pressable onPress={() => {
        item.isUpdate = true;
        navigation.navigate("CreateNote", item);
      }}>
        <View style={styles.noteView}>
          <View style={styles.listView1}>
            <Image
              source={item.icon}
              style={styles.noteCategory}
            />
          </View>
          <View style={styles.listView2}>
            <View style={styles.noteNameView}>
              <Text style={styles.noteName}>{item.title}</Text>
            </View>
            <View style={styles.noteDescriptionView}>
              <Text style={styles.noteDescription}>{item.description}</Text>
            </View>
          </View>
          <View style={styles.listView3}>
            <Text style={styles.noteDate}>{item.date} {item.time}</Text>
          </View>
        </View>
      </Pressable>
    );
    return ui;
  }
  async function isLog() {
    let m = await AsyncStorage.getItem('mobile');
    let p = await AsyncStorage.getItem('password');
    if (m == null && p == null) {
      navigation.navigate("SignIn");
    }
  }
  async function searchNote(text){
    setNoteTitile(text);
    const mobile = await AsyncStorage.getItem("mobile");
    const data = {
      "mobile": mobile,
      "title": text,
    }
    fetch('http://10.0.2.2/NoteApp/searchUserNote.php', {
      method: "post",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data)
    }).
      then(response => response.json()).
      then(json => {
        for (let type of json) {
          switch (type["icon"]) {
            case 1:
              type["icon"] = require("./asset/img/workIcon.png");
              break;
            case 2:
              type["icon"] = require("./asset/img/studyIcon.png");
              break;
            case 3:
              type["icon"] = require("./asset/img/plansIcon.png");
              break;
            default:
              type["icon"] = require("./asset/img/personalIcon.png");
          }
        }
        setData(json);
      }).catch(error => Alert.alert("Error", error));
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    // backgroundColor: 'red',
  },
  view1: {
    flex: 1,
    flexDirection: 'row',
  },
  view2: {
    flex: 9,
    // backgroundColor: 'blue',
  },
  view3: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  noteView: {
    backgroundColor: 'white',
    height: 65,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 3,
    borderRadius: 15,
    overflow: 'hidden',
    // borderWidth:0.4,
  },
  listView1: {
    flex: 3,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listView2: {
    flex: 10,
    paddingStart: 5,
    // backgroundColor: 'blue',
  },
  listView3: {
    flex: 5,
    // backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  noteNameView: {
    flex: 5,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  noteDescriptionView: {
    flex: 4,
    // backgroundColor: 'green',
    justifyContent: 'center',
  },
  noteCategory: {
    height: 35,
    width: 35,
    objectFit: 'contain',
  },
  noteName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  noteDescription: {
    fontSize: 13,
  },
  noteDate: {
    marginEnd: 14,
    marginTop: 6,
    fontSize: 12,
    textAlign: 'right',
    color: "#009dff"
  },
  searchViewDisplayNone: {
    display: 'none',
  },
  searchViewDisplay: {
    paddingStart: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 18,
  },
  titleView1: {
    flex: 5,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 14,
    color: "#009dff"
  },
  titleView2: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  searchIcon: {
    width: 37,
    height: 37,
    objectFit: 'contain'
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
