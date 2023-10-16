import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
} from 'react-native';
import { SignInUi } from './SignIn';
import { SignUpUi } from './SignUp';
import { CreateNoteUi } from './CreateNote';
import { HomeUi } from './Home';
import { ProfileUi } from './Profile';

const Stack = createNativeStackNavigator();

function App() {
  const ui = (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false,animation:'fade',statusBarColor:'#009dff'}}>
        <Stack.Screen name='SignIn' component={SignInUi} />
        <Stack.Screen name='SignUp' component={SignUpUi} />
        <Stack.Screen name='Home' component={HomeUi} />
        <Stack.Screen name='CreateNote' component={CreateNoteUi} />
        <Stack.Screen name='Profile' component={ProfileUi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  return ui;
}
export default App;