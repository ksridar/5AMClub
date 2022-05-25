import { collection, getDoc, getFirestore, query, where, arrayUnion, arrayRemove, setDoc, doc, updateDoc, getDocs, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA2VS7uf7CrwYx215IYhvhdiC1itW7aM8Y",
    authDomain: "am-club-2ae7c.firebaseapp.com",
    projectId: "am-club-2ae7c",
    storageBucket: "am-club-2ae7c.appspot.com",
    messagingSenderId: "148454263679",
    appId: "1:148454263679:web:63e4f8488f78ed8c3f284a"
}

initializeApp(firebaseConfig);



const db = getFirestore()

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("auth", user.uid)
    }
})


export async function createUser(data) {
    const uid = localStorage.getItem("auth")
    const firstName = data.fName
    const lastName = data.lName
    const email = data.email
    const daysWokeUpArray = []
    const totalDaysWokeUp = 0

    await setDoc(doc(db, 'users', uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        daysWokeUpArray: daysWokeUpArray,
        totalDaysWokeUp: totalDaysWokeUp
    }).then(() => {
        console.log("User Created!");
    })
}

export async function getUserDetails() {
    let fName = ''
    let lName = ''
    let email = ''
    let daysWokeUpArray = []
    let totalDaysWokeUp = 0
    const uid = localStorage.getItem('auth')

    if (uid) {
        const docRef = doc(db, 'users', uid);
        await getDoc(docRef).then((doc) => {
            fName = doc.data().firstName
            lName = doc.data().lastName
            email = doc.data().email
            daysWokeUpArray = doc.data().daysWokeUpArray || []
            totalDaysWokeUp = doc.data().totalDaysWokeUp || 0
        })

        return {
            fName,
            lName,
            email,
            daysWokeUpArray,
            totalDaysWokeUp
        }
    }
}

export async function updateData() {
    const uid = localStorage.getItem('auth')

    await updateDoc(doc(db, 'users', uid), {
        totalDaysWokeUp: increment(1),
        daysWokeUpArray: arrayUnion(new Date())

    }).then(() => {
        console.log("updated");
    })
}

export async function lastSevenDays() {
    const wokeUp = []
    const min = new Date()
    min.setDate(min.getDate() - 6)
    min.setHours(0, 0, 0, 0)
    const uid = localStorage.getItem('auth')

        const docRef = doc(db, 'users', uid);
        await getDoc(docRef).then((doc) => {
            doc.data().daysWokeUpArray.map(a => {
                let d = new Date(a.seconds * 1000)
                let nd = new Date(a.seconds * 1000)
                let s = d.setHours(0, 0, 0, 0)

                    wokeUp.push({
                        x: s,
                        y: nd.getHours()
                    })
            })
        })
        console.log(wokeUp)

    return {
            wokeUp, min
        }
}

export async function getLeaderBoard() {
    let leaderBoard = []
    const uid = localStorage.getItem('auth')

        let q2 = query(collection(db, 'users'))
        await getDocs(q2).then(querySnapShot => {
            querySnapShot.forEach((doc) => {
                    leaderBoard.push({
                        name: doc.data().firstName + " " + doc.data().lastName,
                        totalDays: doc.data().totalDaysWokeUp
                    });
            });
        });
        leaderBoard.sort((a,b)=> {
            return b.totalDays - a.totalDays
        })
        return leaderBoard
}

export async function getWeeklyLeaderBoard() {
    let weeklyLeaderBoard = []
 
        const previousMonday = new Date();
        const date = new Date()
      
        previousMonday.setDate(date.getDate() - ((date.getDay() + 7) % 7));
    

        let q2 = query(collection(db, 'users'))
        await getDocs(q2).then(querySnapShot => {
            querySnapShot.forEach((doc) => {
                let totalDays = 0;
                doc.data().daysWokeUpArray.map(a => {
                    let d = new Date(a.seconds * 1000)
                    if (d >= previousMonday) {
                        totalDays++
                    }
                })
                weeklyLeaderBoard.push({
                    name: doc.data().firstName + " " + doc.data().lastName,
                    totalDays: totalDays
                })
            });
        });
        weeklyLeaderBoard.sort((a,b)=> {
            return b.totalDays - a.totalDays
        })
        return weeklyLeaderBoard
}
