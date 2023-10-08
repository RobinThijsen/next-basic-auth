const { NextResponse } = require("next/server")
const { compare } = require("bcrypt")
const prisma = require("./lib/prisma")

const SignIn = async (req) => {
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

const SignUp = async (req) => {
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
            message: "register successfully"
        },
        {
            status: 200
        }
    )
}

module.exports = {
    SignIn,
    SignUp
}