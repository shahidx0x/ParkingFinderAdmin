import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function updateUsers({ id, data: toUpdate, config }) {
  const results = await axios
    .patch(fireStoreCollectionsEndPoint.users + "/" + id, toUpdate, config)
    .then((res) => {
      return res.data;
    });
  return results;
}
