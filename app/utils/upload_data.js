import { database } from "../firebase";
import {ref, set,child, get} from "firebase/database";

function UploadUserData(userEmailId, name, dpurl,) {
    const userRef = ref(database, "users/" + userEmailId);
    get(userRef).then((userSnapshot) => {
        if (!userSnapshot.exists()) {
            set(userRef, {
                Name: name,
                dpUrl: dpurl
            }).then(() => {
                console.log("User data uploaded successfully.");
            }).catch((error) => {
                console.error("Error uploading user data:", error);
            });
        } else {
            console.log("User already exists. No action taken.");
        }
    }).catch((error) => {
        console.error("Error checking user existence:", error);
    });
}

function UploadUserphNumber(userEmailId, phnumber) {
  const userRef = ref(database, "users/" + userEmailId);
  const phNumberRef = child(userRef, "phNumber");

  get(phNumberRef)
    .then((userSnapshot) => {
      if (!userSnapshot.exists()) {
        set(phNumberRef, phnumber)
          .then(() => {
            console.log("User's phNumber uploaded successfully.");
          })
          .catch((error) => {
            console.error("Error uploading user's phNumber:", error);
          });
      } else {
        console.log("User's phNumber already exists. No action taken.");
      }
    })
    .catch((error) => {
      console.error("Error checking user's phNumber existence:", error);
    });
}



//UploadUserData calling
function modifyEmail(email) {
    const sanitizedEmail = email.replace(/[.@]/g, '_').toLowerCase();
    return sanitizedEmail;
}

export {modifyEmail,UploadUserData,UploadUserphNumber}