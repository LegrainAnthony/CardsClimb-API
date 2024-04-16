
//  #################################################
//  ###########           BOXES          ############
//  #################################################

export const boxSeeder = async (prisma, usersCollection) =>  {

    const boxes = [
        {
          id: 1,
          name: 'Long terme',
          user : { connect: { id: usersCollection[0].id }},
        },
        {
          id: 2,
          name: 'Court terme',
          user : { connect: { id: usersCollection[0].id }},
        },
        {
          id: 3,
          name: 'Long terme',
          user : { connect: { id: usersCollection[1].id }},
        },
        {
          id: 4,
          name: 'Court terme',
          user: { connect: { id: usersCollection[1].id }},
        },
      ];
    

      const boxesCollection = await prisma.$transaction(
        boxes.map(box =>
          prisma.box.upsert({
            where: { id: box.id },
            update: {},
            create: {
              name: box.name,
              user: box.user
            }
          })
        )
      )

  return boxesCollection
}