import axios from "axios";

import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getAdmins() {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.admins)
    .then((res) => {
      return res.data.documents;
    });
  return results;
}
