import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList,Button } from 'react-native'

import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Home(props) {
    const [posts, setPosts] = useState([]);

    /*
    useEffect(() => {
        let posts = [];
        if(props.usersLoaded == props.friend.length){
            for(let i = 0; i < props.friend.length; i++){
                const user = props.users.find(el => el.uid === props.friend[i]);
                if(user != undefined){
                    posts = [...posts, ...user.posts]
                }
            }
            posts.sort(function(x,y) {
                return x.creation - y.creation;
            })

            setPosts(posts);
        }

    }, [props.usersLoaded])
    */

    useEffect(() => {
        if (props.usersFriendLoaded == props.friend.length && props.friend.length !== 0) {
            props.home.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.home);
        }
        console.log(posts)

    }, [props.usersFriendLoaded, props.home])

    
    return (
        <View style={styles.container}>
            {/* 
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Text style={styles.container}>Plant Name: {item.plantName}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <Text
                                onPress={() => props.navigation.navigate('Comment', 
                                { postId: item.id, uid: item.user.uid })}>
                                View Comments...
                                </Text>
                        </View>

                    )}
                
                />
                     

            </View>
            
            */}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    
    friend: store.userState.friend,
    home: store.usersState.home,
    usersFriendLoaded: store.usersState.usersFriendLoaded,

})
export default connect(mapStateToProps, null)(Home);