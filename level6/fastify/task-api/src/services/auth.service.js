import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export async function registerUser(data) {
    try {
        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user");
    }
}

export async function loginUser(data) {
    try {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error("Failed to login user");
    }
}

