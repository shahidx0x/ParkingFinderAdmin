import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function deleteUsers(id, config) {
  const results = await axios
    .delete(fireStoreCollectionsEndPoint.users + "/" + id, config)
    .then((res) => {
      return res.data;
    });
  console.log(results);
  return results;
}
