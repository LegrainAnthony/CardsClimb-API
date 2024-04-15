
import { PrismaClient } from '@prisma/client'
import { wait } from '@testing-library/user-event/dist/utils'
import { hash, hashSync } from 'bcrypt'

const prisma = new PrismaClient()
const password = 'Password@test1!'

async function main() {
  const user = [{
    where: { email: 'test@gmail.com' },
    update: {},
    create: {
      username: 'Test',
      email: 'test@gmail.com',
      hashed_password: hashSync(password, 10)
    }
  }]

  const collection = await prisma.$transaction(
    userData.map(cur =>
      prisma.cur.upsert({
        where: { id: cur.id },
        update: {},
        create: { id: cur.id },
      })
    )
  )

  const card = await prisma
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })