import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";

export async function register(req, reply) {
    try {
        const user = await registerUser(req.body);
        const { password, ...safeUser } = user;

        return reply.status(201).send({
            message: "User registered successfully",
            user: safeUser
        });
    } catch (error) {
        if (error.message === "Email already exists") {
            return reply.code(409).send({
                message: error.message,
            });
        }

        return reply.code(500).send({
            message: "Internal Server Error",
        });
    }
}



export async function login(req, reply) {
    try {
        const user = await loginUser(req.body);

        // const token = await reply.jwtSign({
        //     id: user.id,
        //     email: user.email
        // })


        const accessToken = await reply.jwtSign(
            {
                id: user.id,
                email: user.email,
            },
            {
                expiresIn: "15m",
            }
        );


        const refreshToken = await reply.jwtSign(
            {
                id: user.id,
                email: user.email,
            },
            {
                expiresIn: "7d",
            }
        );


        return reply.status(200).send({
            message: "User logged in successfully",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        return reply.code(401).send({
            message: error.message
        });
    }
}



export async function logout(req, reply) {
    return reply.send({
        message: "Logout successful",
    });
}



export async function refresh(req, reply) {
    const { refreshToken: token } = req.body;

    try {
        const payload = await req.jwt.verify(token);

        const accessToken = await reply.jwtSign(
            {
                id: payload.id,
                email: payload.email,
            },
            {
                expiresIn: "15m",
            }
        );

        return reply.send({
            accessToken,
        });
    } catch (error) {
        return reply.code(401).send({
            message: "Invalid refresh token",
        });
    }
}