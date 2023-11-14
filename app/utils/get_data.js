import { database } from "../firebase";
import { ref, child, get } from "firebase/database";

async function GetUserName(userEmailId) {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Name"));

        if (snapshot.exists()) {
            const Name = snapshot.val();
            return Name; // Return the data
        } else {
            throw new Error("No data available");
        }
    } catch (error) {
        throw error; // Throw the error
    }
}

async function GetUserPhotoUrl(userEmailId) {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "users/" + userEmailId + "/dpUrl"));

        if (snapshot.exists()) {
            const Dpurl = snapshot.val();
            return Dpurl; // Return the data
        } else {
            throw new Error("No data available");
        }
    } catch (error) {
        throw error; // Throw the error
    }
}

async function GetUserphNumber(userEmailId) {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "users/" + userEmailId + "/phNumber"));

        if (snapshot.exists()) {
            const Dpurl = snapshot.val();
            return Dpurl; // Return the data
        } else {
           return "";
        }
    } catch (error) {
        throw error; // Throw the error
    }
}

function GetAllPropertyData() {
    return new Promise(async (resolve, reject) => {
      try {
        const dbRef = ref(database, "property");
        const snapshot = await get(dbRef);
  
        if (snapshot.exists()) {
          const propertyData = snapshot.val();
          const propertyInfoArray = [];
  
          for (const propertyId in propertyData) {
            if (propertyData.hasOwnProperty(propertyId)) {
              const property = propertyData[propertyId];
              const propertyInfo = {
                title: propertyId,
                description: property.Description,
                bedroom: property.Bedroom,
                bathroom: property.Bathroom,
                price: property.Price,
                area: property.Area,
                type: property.Type,
                url1: property.Url1,
                url2: property.Url2,
                url3: property.Url3,
                url4: property.Url4,
                stars: property.Stars,
              };
  
              propertyInfoArray.push(propertyInfo);
            }
          }
  
          resolve(propertyInfoArray);
        } else {
          reject(new Error("No properties found"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  

export {GetUserName,GetUserPhotoUrl,GetUserphNumber,GetAllPropertyData}