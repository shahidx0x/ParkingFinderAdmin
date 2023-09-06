import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function addUsers(data, config) {
  console.log(data);
  const results = await axios
    .post(fireStoreCollectionsEndPoint.users, data, config)
    .then((res) => {
      return res.data;
    });
  console.log(results);
  return results;
}
