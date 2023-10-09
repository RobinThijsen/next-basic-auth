# next-basic-auth
## Basic and simple authenticator for full next.js project
### installation

1. First execute
`npm install next-basic-auth`
or
`npm i next-basic-auth`
then init your database in backward, WAMP or MAMP is a good way. [MAMP](https://www.mamp.info/en/mamp-pro/mac/)

2. When it's done, run
`npx prisma init --datasource-provider mysql|sqlite|...`
Doc of prisma for more information about database [here](https://www.prisma.io/docs/guides)

3. After that, go on `/prisma/schema.prisma` and create a db model `user` (the name is really important):
```prisma
model user {
  uid        Int       @id @default(autoincrement())
  pseudo     String
  email      String    @unique
  password   String
  created_at DateTime  @default(now())
  updated_at DateTime? @updatedAt
}
```

4. Then go on `.env` files and change
```dotenv
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
```
for example
```dotenv
DATABASE_URL="mysql://root:root@localhost:8080/my_database"
```

5. Now, migrate your database with
`npx prisma migrate dev --name init`

### And installation is done
### Setup

1. You will need to create a form component, for example:

```typescript jsx
// typescript

import { SingIn } from "/next-basic-auth/index"
import type { NextResponse } from "next/server"

const SignIn = async () => {

    const handleSubmit = async (formData: FormData): void => {
        'use server'
        const email: string = formData.get('email')
        const password: string = formData.get('password')

        const res: Promise<NextResponse> = await SignIn({
            body: JSON.stringify({email: email, password: password})
        })

        // type of result
        // user {
        //     uid: 1,
        //     pseudo: "me",
        //     email: "me@gmail.com",
        //     created_at: "202310091330040Z",
        //     updated_at: null
        // },
        // message: "login successfully",
        // status: 200
        
        const user: Promise<{
            user: { 
                uid: number | string,
                pseudo: string,
                email: string,
                created_at: string,
                updated_at: string | null
            } | null,
            message: string,
            status: number
        }> = await res.json()
        
        // debugging result 
        console.log(user)
    }

    return <form action={handleSubmit}>
        <fieldset>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" placeholder="example@gmail.com"/>
        </fieldset>
        <fieldset>
            <label htmlFor="email">Password</label>
            <input id="password" type="password" name="password" placeholder="********"/>
        </fieldset>
        <button type="submit">Sign in</button>
    </form>

}
```

2. When it's done, you should be able to login.

### additional 

For the sign up page, that's globally the same as sign in. The real difference will be import SignUp 
function and give it pseudo, email, password and confirm password from form.
```typescript
import { SignUp } from "/next-basic-auth"
import type { NextResponse } from "next/server";

const res: Promise<NextResponse> = await SignUp({
    body: JSON.stringify({ pseudo: pseudo, email: email, password: password, cPassword: cPassword })
})
```

