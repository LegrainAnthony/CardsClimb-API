
//  #################################################
//  ###########        CARD TYPES        ############
//  #################################################

export const cardTypeSeeder = async (prisma) =>  {

    const cardTypes = [
        {
          name: 'Flash',
        },
        {
          name: 'Lessons',
        }
      ];
    
      const cardTypesCollection = await prisma.$transaction(
        cardTypes.map(cardType =>
          prisma.cardType.upsert({
            where: { name: cardType.name },
            update: {},
            create: {
              name: cardType.name
            }
          })
        )
      )

  return cardTypesCollection
}