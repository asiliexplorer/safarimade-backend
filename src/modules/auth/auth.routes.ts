import express from "express";
import { authMiddleware } from "../../common/middleware/authMiddleware";
import { roleMiddleware } from "../../common/middleware/roleMiddleware";
import { AuthController } from "./auth.controller";
import { loginValidator, registerValidator } from "./auth.validator";

const router = express.Router();

/**
 * @openapi
 * info:
 *   title: Modular Express API
 *   version: "1.0.0"
 *   description: Example API using modular structure
 * servers:
 *   - url: http://localhost:4000/api
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64a1f4f5e4b0c4a3b2d1e6f7
 *         email:
 *           type: string
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [admin, customer, company]
 *         companyStatus:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       required:
 *         - id
 *         - email
 */

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication & Authorization API
 *   - name: Users
 *     description: User & Company management endpoints (Admin only)
 */

/**
 * @openapi
 * /api/auth/register/customer:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: customer@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               name:
 *                 type: string
 *                 example: Customer User
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /api/auth/register/company:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new company (status = pending)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: company@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               name:
 *                 type: string
 *                 example: My Company Ltd
 *     responses:
 *       201:
 *         description: Company registered successfully (pending approval)
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /api/auth/register/admin:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new admin (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               name:
 *                 type: string
 *                 example: Super Admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only admin can create admin)
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user & get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get currently logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns logged-in user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/auth/company/{id}/status:
 *   post:
 *     tags: [Auth]
 *     summary: Approve or Reject a company account (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1234-5678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Company status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */

/**
 * @openapi
 * /api/auth/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     description: Returns a paginated list of all users. Supports filtering by role, email and name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 50
 *         description: Items per page (max 100)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, customer, company]
 *         description: Filter by role
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by exact email
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (case-insensitive partial match)
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (admin only)
 */

/**
 * @openapi
 * /api/auth/users/companies:
 *   get:
 *     tags: [Users]
 *     summary: Get all companies (admin only)
 *     description: Returns only users with role = company. Optionally filter by companyStatus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter companies by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 50
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */

/* ===========================
   ACTUAL ROUTES (below)
   Keep swagger blocks above this area
=========================== */

router.post("/register/customer", registerValidator, (req, res, next) => {
  req.body.role = "customer";
  return AuthController.register(req, res, next);
});

router.post("/register/company", registerValidator, (req, res, next) => {
  req.body.role = "company";
  return AuthController.register(req, res, next);
});

router.post("/register/admin", registerValidator, (req, res, next) => {
  req.body.role = "admin";
  return AuthController.register(req, res, next);
});

router.post("/login", loginValidator, AuthController.login);

router.get("/me", authMiddleware, AuthController.me);

router.post(
  "/company/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  AuthController.setCompanyStatus
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  AuthController.listUsers
);

router.get(
  "/users/companies",
  authMiddleware,
  roleMiddleware("admin"),
  AuthController.listCompanies
);

export default router;
