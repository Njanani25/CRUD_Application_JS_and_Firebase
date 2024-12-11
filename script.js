import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const appSetting = {
    databaseURL: "https://js-crud-3ed7a-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const usersListInDB = ref(database, "users");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const ageEl = document.querySelector("#age");
const cityEl = document.querySelector("#city");
const frm = document.querySelector("#frm");
const tblbodyEl = document.querySelector("#tblbody");

frm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (idEl.value) {
        // Update record
        const updatedUser = {
            name: nameEl.value.trim(),
            age: ageEl.value.trim(),
            city: cityEl.value.trim(),
        };
        const userRef = ref(database, `users/${idEl.value}`);
        set(userRef, updatedUser);
        clearElements();
        idEl.value = ""; // Clear the hidden ID field after updating
        return;
    }
    if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()) {
        alert("Please fill all details");
        return;
    }
    // Insert new user
    const newUser = {
        name: nameEl.value.trim(),
        age: ageEl.value.trim(),
        city: cityEl.value.trim(),
    };
    push(usersListInDB, newUser);
    clearElements();
});

function clearElements() {
    nameEl.value = "";
    ageEl.value = "";
    cityEl.value = "";
}

onValue(usersListInDB, function (snapshot) {
    if (snapshot.exists()) {
        const userArray = Object.entries(snapshot.val());
        tblbodyEl.innerHTML = ""; // Clear previous content
        userArray.forEach((currentUser, index) => {
            const currentUserID = currentUser[0];
            const currentUserValue = currentUser[1];

            tblbodyEl.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${currentUserValue.name}</td>
                    <td>${currentUserValue.age}</td>
                    <td>${currentUserValue.city}</td>
                    <td><button class="btn-edit" data-id="${currentUserID}">
                        <ion-icon name="create-outline"></ion-icon>
                    </button></td>
                    <td><button class="btn-delete" data-id="${currentUserID}">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button></td>
                </tr>`;
        });
        // Attach event listeners for edit and delete buttons
        document.querySelectorAll(".btn-edit").forEach(button => {
            button.addEventListener("click", function () {
                const userID = this.getAttribute("data-id");
                const userRef = ref(database, `users/${userID}`);
                onValue(userRef, snapshot => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        idEl.value = userID; // Store ID for updating
                        nameEl.value = userData.name;
                        ageEl.value = userData.age;
                        cityEl.value = userData.city;
                    }
                }, { onlyOnce: true });
            });
        });

        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", function () {
                const userID = this.getAttribute("data-id");
                const userRef = ref(database, `users/${userID}`);
                remove(userRef);
            });
        });
    } else {
        tblbodyEl.innerHTML = "<tr><td colspan='6'>No Record Found</td></tr>";
    }
});
