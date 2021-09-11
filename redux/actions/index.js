import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FRIEND_STATE_CHANGE, USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import firebase from 'firebase'
require('firebase/firestore')

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists){
                    //console.log(snapshot.data())
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                }
                else{
                    console.log('dose not exit')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
            })
    })
}

export function fetchUserFriend() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("friend")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFriend")
            .onSnapshot((snapshot) => {
                let friend = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FRIEND_STATE_CHANGE, friend });
                for(let i=0; i<friend.length; i++) {
                    dispatch(fetchUsersData(friend[i], true));
                }
            })
    })
}

export function fetchUsersData(uid, getPosts){
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists){
                    //console.log(snapshot.data())
                    let user = snapshot.data();
                    user.uid = snapshot.id;
                    dispatch({type: USERS_DATA_STATE_CHANGE, user});
                }
                else{
                    console.log('dose not exit')
                }
            })
            if(getPosts){
                dispatch(fetchUsersFriendPosts(uid));
            }
        }
    })
}

export function fetchUsersFriendPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {

                //const uid = snapshot.query.EP.path.segments[1];
                //console.log({snapshot, uid});
                const uid = snapshot._.query.C_.path.segments[1];
                //const uid = snapshot.docs[0].ref.path.split('/')[1];
                const user = getState().usersState.users.find(el => el.uid === uid);
                
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })
                
                //console.log(posts)
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
                //console.log(getState())
                
            })
    })
}