import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getAdminMsg() {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.messageAdmin)
    .then((res) => {
      return res.data;
    });
  return results;
}
