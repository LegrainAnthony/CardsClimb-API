

//  #################################################
//  ############           USER          ############
//  #################################################

import { hash, hashSync } from 'bcrypt'

export const userSeeder = async (prisma) =>  {
  const password = 'Password@test1!'
  const users = [
    {
      username: 'Test',
      email: 'test@gmail.com',
      hashed_password: hashSync(password, 10)
    },
    {
      username: 'Test2',
      email: 'test2@gmail.com',
      hashed_password: hashSync(password, 10)
    }
  ];

  const usersCollection = await prisma.$transaction(
    users.map(user =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          username: user.username,
          email: user.email,
          hashed_password: user.hashed_password
        }
      })
    )
  )

  return usersCollection
}