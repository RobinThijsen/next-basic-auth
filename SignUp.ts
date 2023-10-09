import prisma from "./lib/prisma"
import { NextResponse } from "next/server"


const SignUp = async (req: { body: string }) => {
    const body = JSON.parse(req.body)
    const { pseudo, email, password, cPassword } = body

    const isUserExist = await prisma.user.findUnique({
        where: { email: email }
    })

    if (isUserExist) return NextResponse.json(
        {
            user: null,
            message: "Email exist"
        },
        {
            status: 400,
            statusText: "User with this email already exist"
        }
    )

    if (password !== cPassword) return NextResponse.json(
        {
            user: null,
            message: "Password different"
        },
        {
            status: 400,
            statusText: "Passwords are different"
        }
    )

    const newUser = await prisma.user.create({
        data: {
            pseudo: pseudo,
            email: email,
            password: password
        }
    })

    if (!newUser) return NextResponse.json(
        {
            user: null,
            message: "Something went wrong"
        },
        {
            status: 500,
            statusText: "Something went wrong, try again later"
        }
    )

    const { password: newPassword, ...rest } = newUser

    return NextResponse.json(
        {
            user: rest,
            message: "registration successfully"
        },
        {
            status: 200
        }
    )
}

module.exports = SignUp