const firebaseDB = firebase.database().ref("/polApp");

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

    // firebaseDB.child("AppData/Polling").push(myFormData)
    firebaseDB.child("poling" + "/" + myFormData.heading.toLowerCase() + '/')
        .once("value", (data) => {
            let polingData = data.val()
            if (polingData === null) {
                firebaseDB.child("poling" + "/" + myFormData.heading.toLowerCase() + '/').set(myFormData)
                    .then(() => {
                        pollHeading.value = "";
                        question.value = "";
                        optionA.value = "";
                        optionB.value = "";
                    });
                document.getElementById('exampleModalCenter').hidden;
            } else {
                alert("Your created name is already exsist")
            }
        })

}

var ul = document.getElementById("pollings");
function getData() {
    // firebaseDB.child("AppData/Polling/").once("value")
    firebaseDB.child("poling/").once("value")
        .then(function (result) {
            var listArray = []
            var postObject = result.val();
            console.log(result.val(), 'result')
            for (var key in postObject) {
                console.log(postObject[key], "for var key")
                listArray.push(postObject[key])
            }
            console.log(listArray, "listArray")
            listArray.map((v, i) => {
                var li = document.createElement('li')
                var text = document.createTextNode(v.heading);
                var button = document.createElement('button');
                var btnText = document.createTextNode('Vote');
                li.appendChild(text);
                button.appendChild(btnText)
                button.className = 'btn btn-info'
                li.appendChild(button)
                ul.appendChild(li)
                button.addEventListener('click', () => {
                    console.log(v.heading)
                    var votArray = []
                    var user = firebase.auth().currentUser.uid;
                    firebaseDB.child("voted/").once("value", (data) => {
                        let dataVoted = data.val()
                        // console.log(dataVoted)
                        for (var key in dataVoted) {
                            console.log(dataVoted[key])
                            for (var prop in dataVoted[key]) {
                                console.log(dataVoted[key][prop])
                                votArray.push(dataVoted[key][prop])
                            }
                        }
                        var flag = false;
                        for (var i = 0; i < votArray.length; i++) {
                            console.log(votArray[i], "for")
                            if (user === votArray[i]) {
                                flag = true
                                swal('Error', `You are already voted`, 'error');
                                // button.disabled = true;

                            }
                        }
                        if (flag === false) {
                            firebaseDB.child("voted" + '/' + v.heading + "/").push(user)
                            swal('Done', `You voted for ${v.heading}`, 'success');
                        }
                    })
                })
            })
        })
}


function voted() {
    alert("aasdas")
    var list = document.getElementsByTagName('li')
    console.log(list, 'list')
}