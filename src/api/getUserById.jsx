import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getUserById({ queryKey }) {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.users + "/" + queryKey[1])
    .then((res) => {
      return res.data.fields;
    });

  return results;
}
