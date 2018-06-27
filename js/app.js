const firebaseDB = firebase.database().ref("/Poll App");

/* Authentication Details Start */

var uid;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        email = user.email;
        uid = user.uid;
        console.log(email);
        console.log(uid);
    }
    else {
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("loginBtn").style.display = "inline";
        console.log("Please login to see your todos");
        console.log("User is signed out.\nPlease login!");
    }
});

function logOut() {
    firebase.auth().signOut()
        .then(resolve => {
            window.location.replace("index.html");
            console.log("Succesfully Signed-Out", resolve);
        })
        .catch(error => {
            console.log("Error", error);
        });
};
/* Authentication Details End*/


/* setting db */

function uploadPoll() {
    var currentUser = firebase.auth().currentUser.uid;
    console.log(currentUser, 'currentUser')

    var pollHeading = document.getElementById("pollHeading");
    var question = document.getElementById("question");
    var optionA = document.getElementById("optionA");
    var optionB = document.getElementById("optionB");

    var myFormData = {
        heading: pollHeading.value,
        question: question.value,
        optionA: optionA.value,
        optionB: optionB.value,
        uid: currentUser
    }

    firebaseDB.child("AppData/Polling").push(myFormData)
        .then(() => {
            pollHeading.value = "";
            question.value = "";
            optionA.value = "";
            optionB.value = "";
        });
}

var ul = document.getElementById("pollings");
function getData() {
    firebaseDB.child("AppData/Polling/").once("value")
        .then(function (result) {
            var postObject = result.val();       /*we call all the data from appdata*/
            var keys = Object.keys(postObject);  /*we are again asking for todo unique key so that we can run our loop till the end of todo list*/
            console.log(keys);
            for (let i = 0; i < keys.length; i++) {
                let currentObject = postObject[keys[i]];  /*we got the first todo and enter to the first todo*/
                console.log(currentObject);
                let voteBTN = document.createElement("button");
                let li = document.createElement("LI");
                var buttontext = document.createTextNode("Vote");
                voteBTN.appendChild(buttontext);
                voteBTN.className = 'btn btn-info'
                voteBTN.setAttribute('id','voteBTN')
                let poleText = document.createTextNode(`${currentObject.heading}`)
                li.appendChild(poleText)
                li.appendChild(voteBTN)
                ul.appendChild(li);
                checkUID();
                voteBTN.addEventListener('click', event => {
                    let uid = firebase.auth().currentUser.uid;
                    var obj = {uid: uid}
                    firebaseDB.child("AppData/Voting/" + currentObject.heading + "/").push(obj);
                    // this.style.display = 'none'
                    console.log(keys[i]);
                })
            }
        })
}

function checkUID() {
    firebaseDB.child("AppData/Voting/").once('value')
        .then((data)=>{
            var arrObj = [];
            var objData = data.val();
            console.log(objData);
            for (var key in objData) {
                console.log(objData[key])
                for (var pol in objData[key]) {
                    arrObj.push(objData[key][pol])
                    console.log(objData[key][pol])
                }
            }
            var userUID = firebase.auth().currentUser.uid;
            console.log(arrObj)
            arrObj.map((v,i)=>{
                if (v.uid === userUID) {
                    document.getElementById('voteBTN').style.display='none';
                }
                console.log(v.uid)
            })
        })
    
}

// getData();
// function crateElement(text, element) {
//     var li = document.createElement(element);
//     var textNode = document.createTextNode(text);
//     li.appendChild(textNode);
//     var btn = document.createElement('BUTTON');
//     btn.setAttribute('id', 'voteBTN');
//     btn.className = 'btn btn-info'
//     var btnText = document.createTextNode('VOTE')
//     btn.appendChild(btnText)
//     li.appendChild(btn)
//     // li.setAttribute('class', className);
//     return li;
// }


