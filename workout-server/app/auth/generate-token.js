import jwt from 'jsonwebtoken'

export const generateToken = userId =>
	jwt.sign({ userId }, process.env.JSONWEBTOKEN_SECRET, {
		expiresIn: '10d'
	})
