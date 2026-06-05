import express from 'express'
import { registerUser } from '../../modules/user/user.controller.js'
import { validateBody } from '../../shared/middleware/validate.middleware.js'
import { registrationSchema } from '../../modules/user/user.schema.js'
const router = express.Router()



router.post('/register', validateBody(registrationSchema), registerUser)
export default router