import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import prisma from "/lib/prisma"

const SignIn = async (req: { body: string }) => {
    const body = JSON.parse(req.body)
    const { email, password } = body

    const isUserExist = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!isUserExist) return NextResponse.json(
        {
            user: null,
            message: "No user found"
        },
        {
            status: 404,
            statusText: "User with this email doesn't exist"
        })

    const isPassword = await compare(password, isUserExist.password)

    if (!isPassword) return NextResponse.json(
        {
            user: null,
            message: "password wrong"
        },
        {
            status: 209,
            statusText: "Password wrong"
        }
    )

    const { password: newPassword, ...rest } = isUserExist

    return NextResponse.json(
        {
            user: rest,
            message: "Login successfully"
        },
        {
            status: 200
        }
    )
}

module.exports = SignIn