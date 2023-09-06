import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getUsers() {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.users)
    .then((res) => {
      return res.data.documents;
    });
  return results;
}
