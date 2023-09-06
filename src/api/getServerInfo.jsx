import axios from "axios";
import { fireStoreCollectionsEndPoint } from "../firebase/firestore.api.config";

export async function getServerInfo() {
  const results = await axios
    .get(fireStoreCollectionsEndPoint.serverInfo)
    .then((res) => {
      return res.data.documents;
    });
  return results;
}
