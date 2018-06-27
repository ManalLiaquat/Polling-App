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

    var pollHeading = document.getElementById("pollHeading");
    var question = document.getElementById("question");
    var optionA = document.getElementById("optionA");
    var optionB = document.getElementById("optionB");

    var myFormData = {
        heading: pollHeading.value,
        question: question.value,
        optionA: optionA.value,
        optionB: optionB.value
    }

    firebaseDB.child("App Data").push(myFormData)
        .then(() => {
            pollHeading.value = "";
            question.value = "";
            optionA.value = "";
            optionB.value = "";
        });
}

function getData() {
    firebaseDB.child("App Data").once('value', (data) => {

        var postObject = data.val();
        console.log(postObject, 'postObject');
        var keys = Object.keys(postObject);
        console.log(keys, 'keys');

        var ul = document.getElementById("pollings");

        for (var i = 0; i < keys.length; i++) {
            var currentObj = postObject[keys[i]];
            var createdLi = crateElement(`${currentObj.heading}`, 'LI');
            ul.appendChild(createdLi);
        }

            /* var dataArray = [];
            var pollData = data.val();
            for (var key in pollData) {
                console.log(pollData[key])
                dataArray.push(pollData);
            }
    
            console.log(dataArray);
            var ul = document.getElementById("pollings");
            dataArray.map((v, i) => {
                // if(){
                console.log(v)
                var createdLi = crateElement(`${v.heading}`, 'LI');
                ul.appendChild(createdLi)
                // }
            }); */

            // console.log(data, '[all data]')
        });
}
function crateElement(text, element) {
    var li = document.createElement(element);
    var textNode = document.createTextNode(text);
    li.appendChild(textNode);
    var btn = document.createElement('BUTTON');
    btn.className = 'btn btn-info'
    var btnText = document.createTextNode('VOTE')
    btn.appendChild(btnText)
    li.appendChild(btn)
    // li.setAttribute('class', className);
    return li;
}


/* setting db */

