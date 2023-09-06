import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getFcm({ queryKey }) {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.users + "/" + queryKey[1].stringValue)
    .then((res) => {
      return res.data;
    });

  return results;
}
