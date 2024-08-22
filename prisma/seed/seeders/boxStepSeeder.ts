
//  #################################################
//  ###########           BOXES          ############
//  #################################################

import * as moment from 'moment';


export const cardSeeder = async (prisma, cardTypesCollection, usersCollection, tagsCollection, boxesCollection, boxStepsCollection) =>  {
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
          user_id : usersCollection[1].id,
          reference: "Histoire G #1",
          question : "En quelle année a eu lieu la bataille de Marignan",
          answer: "1515",
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 5,
          user_id : usersCollection[2].id,
          reference: "Culture G #1",
          question : "De quelle couleur est une orange",
          answer: "Orange",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[26] && { boxStep: { connect: { id: boxStepsCollection[26].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 6,
          user_id : usersCollection[2].id,
          reference: "Culture G #2",
          question : "Quelle est la capitale de la France",
          answer: "Paris",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[27] && { boxStep: { connect: { id: boxStepsCollection[27].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 7,
          user_id : usersCollection[2].id,
          reference: "Culture G #3",
          question : "Quelle est la couleur du cheval blanc d'Henri IV",
          answer: "Blanc",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[28] && { boxStep: { connect: { id: boxStepsCollection[28].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 8,
          user_id : usersCollection[2].id,
          reference: "Culture G #3",
          question : "Quelle est la couleur du cheval blanc d'Henri IV",
          answer: "Blanc",
          future_revision: moment().add(1, 'days').format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[28] && { boxStep: { connect: { id: boxStepsCollection[28].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 9,
          user_id : usersCollection[2].id,
          reference: "Histoire G #1",
          question : "En quelle année a eu lieu la bataille de Marignan",
          answer: "1515",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[28] && { boxStep: { connect: { id: boxStepsCollection[28].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 10,
          user_id : usersCollection[2].id,
          reference: "Histoire G #1",
          question : "En quelle année a eu lieu la bataille de Marignan",
          answer: "1515",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[28] && { boxStep: { connect: { id: boxStepsCollection[28].id } } }),
          card_type: { connect: { id: cardTypesCollection[0].id } }
        },
        {
          id: 11,
          user_id : usersCollection[2].id,
          reference: "Histoire G #1",
          question : "En quelle année a eu lieu la bataille de Marignan",
          answer: "1515",
          future_revision: moment().format('x'),
          ...(boxesCollection[4] && { box: { connect: { id: boxesCollection[4].id } } }),
          ...(boxStepsCollection[30] && { boxStep: { connect: { id: boxStepsCollection[30].id } } }),
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
              future_revision: card.future_revision ?? null,
              ...((card.box !== undefined) && { box: card.box }),
              ...((card.boxStep !== undefined) && { boxStep: card.boxStep }),
              answer: card.answer
            } 
          })
        )
      )

  return cardsCollection
}