import express from "express";
import { createNewParcel, trackParcel, dispatchParcel, acceptParcel, makeGroupsusingReq, dispatchParcelGroup } from "../controllers/parcelController.js";

const router = express.Router();
router.post('/createNewParcel', createNewParcel);
router.post('/trackParcel', trackParcel);

router.post('/acceptParcel', acceptParcel);
router.post('/dispatchParcel', dispatchParcel);
router.post('/makeGroups', makeGroupsusingReq);
router.post('/dispatchGroup', dispatchParcelGroup);
// router.post('/acceptParcel', acceptParcel);


export default router;