const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", requestController.getAllGroupedRequests);
router.put("/", requestController.updateRequestStatus);
router.put("/comment", requestController.updateRequestComment);
router.get("/all-leaves", requestController.getAllLeaves);
router.get("/user-requests", verifyToken, requestController.getRequestsByUser);
router.get("/user-request-statuses", requestController.getLeaveStatsByUser);
module.exports = router;
