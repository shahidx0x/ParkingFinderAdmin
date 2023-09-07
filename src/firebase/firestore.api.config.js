const base =
  "https://firestore.googleapis.com/v1/projects/parking-finder-ff81d/databases/(default)/documents";

export const fireStoreCollectionsEndPoint = {
  admins: `${base}/admins`,
  serverInfo: `${base}/const`,
  users: `${base}/Users`,
  garages: `${base}/Garages`,
  parkingPoint: `${base}/ParkingPoint`,
  messageAdmin: `${base}/admins/RkbxVLm8spWcEbMOyxp8H69eQRs2/Messages`,
};
