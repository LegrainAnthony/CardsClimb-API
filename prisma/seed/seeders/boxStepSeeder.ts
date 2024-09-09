
//  #################################################
//  ###########         BOX STEPS        ############
//  #################################################

export const boxStepSeeder = async (prisma, boxesCollection) =>  {
  const boxSteps = [
      {
        id: 1,
        interval: 0,
        box: { connect : { id : boxesCollection[0].id }},
        order : 1
      },
      {
        id: 2,
        interval: 1,
        box: { connect : { id : boxesCollection[0].id }},
        order : 2

      },
      {
        id: 3,
        interval: 3,
        box: { connect : { id : boxesCollection[0].id }},
        order : 3
      },
      {
        id: 4,
        interval: 7,
        box: { connect : { id : boxesCollection[0].id }},
        order : 4
      },
      {
        id: 5,
        interval: 21,
        box: { connect : { id : boxesCollection[0].id }},
        order : 5
      },
      {
        id: 6,
        interval: 30,
        box: { connect : { id : boxesCollection[0].id }},
        order : 6
      },
      {
        id: 7,
        interval: 90,
        box: { connect : { id : boxesCollection[0].id }}
        ,
        order : 7
      },
      {
        id: 8,
        interval: 0,
        box: { connect : { id : boxesCollection[2].id }},
        order : 1
      },
      {
        id: 9,
        interval: 1,
        box: { connect : { id : boxesCollection[2].id }},
        order : 2
      },
      {
        id: 10,
        interval: 3,
        box: { connect : { id : boxesCollection[2].id }},
        order : 3
      },
      {
        id: 11,
        interval: 7,
        box: { connect : { id : boxesCollection[2].id }},
        order : 4
      },
      {
        id: 12,
        interval: 21,
        box: { connect : { id : boxesCollection[2].id }},
        order : 5
      },
      {
        id: 13,
        interval: 30,
        box: { connect : { id : boxesCollection[2].id }},
        order : 6
      },
      {
        id: 14,
        interval: 90,
        box: { connect : { id : boxesCollection[2].id }},
        order : 7
      },
      {
        id: 15,
        interval: 0,
        box: { connect : { id : boxesCollection[1].id }},
        order : 1
      },
      {
        id: 16,
        interval: 1,
        box: { connect : { id : boxesCollection[1].id }},
        order : 2
      },
      {
        id: 17,
        interval: 3,
        box: { connect : { id : boxesCollection[1].id }},
        order : 3
      },
      {
        id: 18,
        interval: 5,
        box: { connect : { id : boxesCollection[1].id }},
        order : 4
      },
      {
        id: 19,
        interval: 7,
        box: { connect : { id : boxesCollection[1].id }},
        order : 5
      },
      {
        id: 20,
        interval: 0,
        box: { connect : { id : boxesCollection[3].id }},
        order : 1
      },
      {
        id: 21,
        interval: 1,
        box: { connect : { id : boxesCollection[3].id }},
        order : 2
      },
      {
        id: 22,
        interval: 3,
        box: { connect : { id : boxesCollection[3].id }},
        order : 3
      },
      {
        id: 23,
        interval: 5,
        box: { connect : { id : boxesCollection[3].id }},
        order : 4
      },
      {
        id: 24,
        interval: 7,
        box: { connect : { id : boxesCollection[3].id }},
        order : 5
      },
      {
        id: 25,
        interval: 0,
        box: { connect : { id : boxesCollection[4].id }},
        order : 1
      },
      {
        id: 26,
        interval: 1,
        box: { connect : { id : boxesCollection[4].id }},
        order : 2

      },
      {
        id: 27,
        interval: 3,
        box: { connect : { id : boxesCollection[4].id }},
        order : 3
      },
      {
        id: 28,
        interval: 7,
        box: { connect : { id : boxesCollection[4].id }},
        order : 4
      },
      {
        id: 29,
        interval: 21,
        box: { connect : { id : boxesCollection[4].id }},
        order : 5
      },
      {
        id: 30,
        interval: 30,
        box: { connect : { id : boxesCollection[4].id }},
        order : 6
      },
      {
        id: 31,
        interval: 90,
        box: { connect : { id : boxesCollection[4].id }}
        ,
        order : 7
      },
    ]
  
    const boxStepsCollection = await prisma.$transaction(
      boxSteps.map(boxStep =>
        prisma.boxStep.upsert({
          where: { id: boxStep.id },
          update: {},
          create: {
            interval: boxStep.interval,
            box: boxStep.box,
            order: boxStep.order
          }
        })
      )
    )
return boxStepsCollection
}