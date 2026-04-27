import express from "express";
import {
  createTravelProposalHandler,
  listTravelProposalsHandler,
} from "./travelProposal.controller";
import { authMiddleware } from "../../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../../common/middleware/roleMiddleware";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     TravelProposal:
 *       type: object
 *       required:
 *         - destinationKnowledge
 *         - reasons
 *         - tripDuration
 *         - arrivalDate
 *         - travelWith
 *         - adults
 *         - children
 *         - budget
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - country
 *       properties:
 *         destinationKnowledge:
 *           type: string
 *         destination:
 *           type: string
 *         reasons:
 *           type: array
 *           items:
 *             type: string
 *         tripDuration:
 *           type: number
 *         arrivalDate:
 *           type: string
 *         travelWith:
 *           type: string
 *         adults:
 *           type: number
 *         children:
 *           type: number
 *         budget:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         whatsapp:
 *           type: string
 *         wattsapp:
 *           type: string
 *         country:
 *           type: string
 *         notes:
 *           type: string
 *         newsletter:
 *           type: boolean
 *
 * tags:
 *   - name: TravelProposal
 *     description: Travel proposal request submissions
 */

/**
 * @openapi
 * /api/travel-proposals:
 *   post:
 *     summary: Submit travel proposal form
 *     tags:
 *       - TravelProposal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TravelProposal'
 *     responses:
 *       "201":
 *         description: Travel proposal saved
 *       "400":
 *         description: Validation error
 */
router.post("/", createTravelProposalHandler);

/**
 * @openapi
 * /api/travel-proposals:
 *   get:
 *     summary: List submitted travel proposals (admin only)
 *     tags:
 *       - TravelProposal
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of travel proposals
 *       "401":
 *         description: Unauthorized
 */
router.get("/", authMiddleware, roleMiddleware("admin"), listTravelProposalsHandler);

export default router;
