// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import userData from "./initialUserData.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const p of userData) {

    const id = "627ed767-4e67-431d-ad65-98609e80ed13";
    
    const user = await prisma.user.create({
      data: {
        id,
        username: p.name,
        email: p.email,
      }
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
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
