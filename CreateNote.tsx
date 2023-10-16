
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
import DropDownPicker from 'react-native-dropdown-picker';

export function CreateNoteUi({ navigation, route }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 1, icon: () => <Image source={require("./asset/img/workIcon.png")} style={styles.dropdownIcon} /> },
        { label: 'Banana', value: 2, icon: () => <Image source={require("./asset/img/workIcon.png")} style={styles.dropdownIcon} /> },
        { label: 'asdas', value: 3, icon: () => <Image source={require("./asset/img/workIcon.png")} style={styles.dropdownIcon} /> },
        { label: 'Pear', value: 4, icon: () => <Image source={require("./asset/img/workIcon.png")} style={styles.dropdownIcon} /> },
    ]);
    const [getId, setId] = useState('');
    const [getDate, setDate] = useState('');
    const [getTime, setTime] = useState('');
    const [getNoteName, setNoteName] = useState('');
    const [getTextAreaValue, onChangeText] = useState('');
    const [getStage, setState] = useState(false);

    useEffect(() => {
        navigation.addListener('focus', () => {
            loadNoteTypes();
            isLog();
            setValue(null);
            setId("");
            setNoteName("");
            onChangeText("");
            setState(false);

            var currentDateTime = new Date();

            var year = currentDateTime.getFullYear();
            var month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
            var day = currentDateTime.getDate().toString().padStart(2, '0');

            var formattedDate = year + '-' + month + '-' + day;

            var hour = currentDateTime.getHours().toString().padStart(2, '0');
            var minute = currentDateTime.getMinutes().toString().padStart(2, '0');
            var second = currentDateTime.getSeconds().toString().padStart(2, '0');

            var formattedTime = hour + ':' + minute + ':' + second;
            setDate(formattedDate);
            setTime(formattedTime);


            if (route.params !== undefined) {
                setUpNote(route.params);
            }
        });
    });

    const ui = (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar hidden={true}/> */}
            <View style={styles.view1}>
                <View style={styles.titleName}>
                    <Text style={styles.titleText}>{getStage ? "Update Your Note" : "Create A Note"}</Text>
                </View>
                <View style={styles.titleIcon}>
                    <View style={styles.saveIconView}>
                        <Pressable onPress={saveNote}>
                            <Image source={require('./asset/img/saveIcon.png')} style={styles.saveIcon} />
                        </Pressable>
                    </View>
                    <View style={styles.deleteIconView}>
                        <Pressable onPress={deleteNote}>
                            <Image source={require('./asset/img/deleteIcon.png')} style={styles.saveIcon} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={styles.view2}>
                <View style={styles.v2view1}>
                    <View style={styles.detailsView}>
                        <View style={styles.details1}>
                            <View style={styles.details1Icon}>
                                <Image source={require('./asset/img/dateIcon.png')} style={styles.dateIcon}></Image>
                            </View>
                            <View style={styles.details1Text}>
                                <Text style={styles.text1}>{getDate} </Text>
                            </View>
                        </View>
                        <View style={styles.details2}>
                            <View style={styles.details1Icon}>
                                <Image source={require('./asset/img/timeIcon.png')} style={styles.dateIcon}></Image>
                            </View>
                            <View style={styles.details1Text}>
                                <Text style={styles.text1}>{getTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.v2view4}>
                    <View style={styles.detailsView2}>
                        <TextInput placeholder='Enter Note Name' value={getNoteName} onChangeText={text => setNoteName(text)} spellCheck={true} />
                    </View>
                </View>
                <View style={styles.v2view2}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={100}
                        maxLength={250}
                        onChangeText={text => onChangeText(text)}
                        value={getTextAreaValue}
                        style={styles.textArea}
                        textAlignVertical='top'
                        placeholder='Description'
                        spellCheck={true}
                    />
                </View>
                <View style={styles.v2view3}>
                    <View style={styles.v3Title2}>
                        <DropDownPicker
                            items={items}
                            open={open}
                            value={value}
                            setValue={setValue}
                            setOpen={setOpen}
                            setItems={setItems}
                            placeholder='Select'
                            style={styles.dropDown}
                        />
                    </View>
                    <View style={styles.v3Title}>
                        {/* <View style={styles.navigationBarView1}>
                            <Pressable onPress={() => navigation.navigate("CreateNote", { isUpdate: false })}>
                                <Image source={require('./asset/img/CreateNoteIcon2.png')} style={styles.navigationBarIcon1} />
                            </Pressable>
                        </View> */}
                        <View style={styles.navigationBarView2}>
                            <Pressable onPress={() => navigation.navigate("Home")}>
                                <Image source={require('./asset/img/HomeIcon.png')} style={styles.navigationBarIcon1} />
                            </Pressable>
                        </View>
                        <View style={styles.navigationBarView3}>
                            <Pressable onPress={() => navigation.navigate("Profile")}>
                                <Image source={require('./asset/img/profileIcon.png')} style={styles.navigationBarIcon3} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
    return ui;
    function setUpNote(item) {
        if (item.isUpdate) {
            if (item.date !== null || item.time !== null || item.title !== null || item.type !== null || item.description !== null) {
                setId(item.id);
                setDate(item.date);
                setTime(item.time);
                setNoteName(item.title);
                setValue(item.type);
                onChangeText(item.description);
                setState(true);
            }
        }
    }
    async function saveNote() {
        let data = [];
        let requestPath = "";

        if (getStage) {
            data = {
                id: getId,
                title: getNoteName,
                description: getTextAreaValue,
                type: value,
            };
            requestPath = "updateNote.php";
        } else {
            const mobile = await AsyncStorage.getItem("mobile");
            data = {
                title: getNoteName,
                description: getTextAreaValue,
                type: value,
                uId: mobile,
            };
            requestPath = "createNote.php";
        }
        fetch('http://10.0.2.2/NoteApp/' + requestPath, {
            method: "post",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data)
        }).
            then(response => response.json()).
            then(json => {
                if (json['response'] === 'Success') {
                    Alert.alert("Request", "Successful");
                    navigation.navigate("Home");
                } else {
                    Alert.alert("Error", json['response'])
                }
            }).catch(error => Alert.alert("Error", error));
    }

    function loadNoteTypes() {
        fetch('http://10.0.2.2/NoteApp/getNoteType.php', {
            method: "post",
            headers: {
                "Content-Type": 'application/json',
            },
        }).
            then(response => response.json()).
            then(json => {
                for (let type of json) {
                    let url = require('./asset/img/workIcon.png');
                    switch (type["icon"]) {
                        case "1":
                            url = require("./asset/img/workIcon.png");
                            break;
                        case "2":
                            url = require("./asset/img/studyIcon.png");
                            break;
                        case "3":
                            url = require("./asset/img/plansIcon.png");
                            break;
                        default:
                            url = require("./asset/img/personalIcon.png");
                    }
                    type["icon"] = (() => <Image source={url} style={styles.dropdownIcon} />)
                }
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

    function deleteNote() {
        const data = {
            id: getId,
        }
        fetch('http://10.0.2.2/NoteApp/deleteProcess.php', {
            method: "post",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data)
        }).
            then(response => response.json()).
            then(json => {
                if (json['response'] === 'Success') {
                    Alert.alert("Request", "Successful");
                    navigation.navigate("Home");
                } else {
                    Alert.alert("Error", json['response'])
                }
            }).catch(error => Alert.alert("Error", error));
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    view1: {
        flex: 1,
        flexDirection: 'row',
    },
    view2: {
        flex: 12,
    },
    v2view1: {
        flex: 2,
    },
    v2view4: {
        flex: 2,
    },
    v2view2: {
        flex: 10,
    },
    textArea: {
        backgroundColor: "white",
        marginHorizontal: 25,
        marginVertical: 13,
        borderRadius: 9,
        padding: 10,
        // borderColor: "#009dff",
        // borderWidth: 1,
    },
    v2view3: {
        flex: 4,
    },
    detailsView: {
        flexDirection: 'row',
        backgroundColor: "white",
        flex: 1,
        marginHorizontal: 25,
        marginVertical: 13,
        borderRadius: 9
    },
    detailsView2: {
        flexDirection: 'row',
        backgroundColor: "white",
        flex: 1,
        marginHorizontal: 25,
        marginVertical: 13,
        borderRadius: 9,
        paddingStart: 15,
        // borderColor: "#009dff",
        // borderWidth: 1,
    },
    details1: {
        flex: 4,
        flexDirection: 'row',
    },
    details2: {
        flex: 3,
        flexDirection: 'row',
    },
    details1Icon: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'
    },
    details1Text: {
        flex: 7,
        justifyContent: 'center',
    },
    text1: {
        color: '#009dff'
    },
    text2: {

    },
    dateIcon: {
        height: 25,
        width: 25,
        objectFit: 'contain',
    },
    titleName: {
        flex: 10,
        justifyContent: 'center',
        marginLeft: 15,
    },
    titleIcon: {
        flex: 4,
        flexDirection: 'row',
        marginEnd: 7,
    },
    v3Title2: {
        justifyContent: "center",
        paddingHorizontal: 25,
        flex: 10,
    },
    v3Title: {
        flex: 8,
        flexDirection: 'row',
        backgroundColor: "white",
    },
    navigationBarView1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationBarView2: {
        flex: 1,
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
    catergoryType: {
        fontSize: 17,
        marginStart: 30,
    },
    titleText: {
        fontSize: 19,
    },
    dropDown: {
        borderWidth: 0,
    },
    saveIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    NoteTypeIcon1: {
        height: 35,
        width: 35,
        objectFit: 'contain'
    },
    saveIcon: {
        height: 30,
        width: 30,
    },
    deleteIcon: {
        height: 30,
        width: 30,
    },
    dropdownIcon: {
        height: 25,
        width: 25,
        objectFit: 'contain',
    }
});
