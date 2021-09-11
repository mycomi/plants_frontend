import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList,Button } from 'react-native'

import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Myplants(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [friend, setFriend] = useState(false);

    useEffect(() => {
        const { currentUser, posts } = props;
        console.log({ currentUser, posts })

        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser)
            setUserPosts(posts)
        }
        else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists){
                    setUser(snapshot.data());
                }
                else{
                    console.log('dose not exit')
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts)
            })
        }

        if(props.friend.indexOf(props.route.params.uid) > -1) {
            setFriend(true);
        }else{
            setFriend(false);
        }


    }, [props.route.params.uid, props.friend])

    const onFriend = () => {
        firebase.firestore()
        .collection("friend")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFriend")
        .doc(props.route.params.uid)
        .set({})
    }
    const onUnfriend = () => {
        firebase.firestore()
        .collection("friend")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFriend")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    
    if(user === null){
        return <View/>
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                    {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                        <View>
                            {friend? (
                                <Button
                                    title="Friend"
                                    onPress={() => onUnfriend()}
                                />

                            ) : (
                                <Button
                                    title="Add Friend"
                                    onPress={() => onFriend()}
                                />
                            )}
                        
                        </View>
                    ) : 
                    <Button
                        title="Logout"
                        onPress={() => onLogout()}
                    />}
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <Text>Plant Name: {item.plantName}</Text>
                        </View>

                    )}
                
                />
                     

            </View>
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
    posts: store.userState.posts,
    friend: store.userState.friend,

})
export default connect(mapStateToProps, null)(Myplants);