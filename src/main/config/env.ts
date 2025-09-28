export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/authentication',
    jwtSecret: process.env.JWT_SECRET || "m@n0=er&"
}