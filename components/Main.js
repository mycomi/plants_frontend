import React, { Component } from 'react'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts, fetchUserFriend, clearData} from '../redux/actions/index';

import HomeScreen from './main/Home'
import MyPlantsScreen from './main/Myplants'
import SearchScreen from './main/Search'


const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {

    componentDidMount(){
        this.props.clearData();
        this.props.fetchUser();  
        this.props.fetchUserPosts();  
        this.props.fetchUserFriend();

    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Home" labeled="false">
                <Tab.Screen name="Home" component={HomeScreen} 
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                    ),
                }}/>
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                    ),
                }}/>
                <Tab.Screen name="MyPlants" component={MyPlantsScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("MyPlants", {uid: firebase.auth().currentUser.uid})
                    }})}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    ),
                }}/>
                <Tab.Screen name="Scan" component={EmptyScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Add")
                    }
                })}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                    ),
                }}/>
            </Tab.Navigator>
           /*
           <View>
               <Text>feed</Text>
           </View>
           */
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFriend, clearData}, dispatch)



export default connect(mapStateToProps, mapDispatchProps)(Main)
