import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getGarages() {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.garages)
    .then((res) => {
      return res.data.documents;
    });
  return results;
}
