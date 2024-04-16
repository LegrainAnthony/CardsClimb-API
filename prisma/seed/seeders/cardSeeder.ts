
//  #################################################
//  ###########           BOXES          ############
//  #################################################

export const cardSeeder = async (prisma, usersCollection, cardTypesCollection, boxesCollection, boxStepsCollection, tagsCollection) =>  {

    const cards = [
        {
          id: 1,
          user_id : usersCollection[0].id,
          reference: "Culture G #1",
          question : "De quelle couleur est une orange",
          answer: "Orange",
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 2,
          user_id : usersCollection[0].id,
          reference: "Culture G #2",
          question : "Quelle est la capitale de la France",
          answer: "Paris",
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 3,
          user_id : usersCollection[1].id,
          reference: "Culture G #3",
          question : "Quelle est la couleur du cheval blanc d'Henri IV",
          answer: "Blanc",
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 4,
          user_id : usersCollection[0].id,
          reference: "Histoire G #1",
          question : "En quelle année a eu lieu la bataille de Marignan",
          answer: "1515",
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
      ];
    
    
      const cardsCollection = await prisma.$transaction(
        cards.map(card =>
          prisma.card.upsert({
            where: { id: card.id },
            update: {},
            create: {
              user: { connect: { id: card.user_id } },
              card_type: card.card_type,
              reference: card.reference,
              question: card.question,
              answer: card.answer
            } 
          })
        )
      )

  return cardsCollection
}