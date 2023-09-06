import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function updateGarages({ id, data: toUpdate, config }) {
  //   console.log(fireStoreCollectionsEndPoint.garages + "/" + id);
  const results = await axios
    .patch(fireStoreCollectionsEndPoint.garages + "/" + id, toUpdate, config)
    .then((res) => {
      return res.data;
    });
  return results;
}
