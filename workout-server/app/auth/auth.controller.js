import { faker } from '@faker-js/faker'
import { hash } from 'argon2'
import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { generateToken } from './generate-token.js'

// @desc   Auth user
// @route  POST /api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany({
		where: {
			password1: 'test'
		}
	})

	res.json(user)
})

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.name.fullName()
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			name: true,
			email: true,
			images: true
		}
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
