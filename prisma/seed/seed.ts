import { PrismaClient } from '@prisma/client'
import { userSeeder, colorSeeder, cardTypeSeeder, tagSeeder, boxSeeder, boxStepSeeder, cardSeeder } from "./seeders"


// Ce Script permet de générer des données de test dans la base de données
// Il est à exécuter naturellement avec la commande `npx prisma migrate dev --name init`
// ou npx prisma db seed

const prisma = new PrismaClient()

async function main() {

  const usersCollection = await userSeeder(prisma);
  const colorsCollection = await colorSeeder(prisma);
  const cardTypesCollection = await cardTypeSeeder(prisma);
  const tagsCollection = await tagSeeder(prisma, colorsCollection, usersCollection);
  const boxesCollection = await boxSeeder(prisma, usersCollection);
  const boxStepsCollection = await boxStepSeeder(prisma, boxesCollection);
  const cardsCollection = await cardSeeder(prisma, cardTypesCollection, usersCollection, tagsCollection, boxesCollection, boxStepsCollection);
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