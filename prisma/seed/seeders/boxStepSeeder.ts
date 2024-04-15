
//  #################################################
//  ###########         BOX STEPS        ############
//  #################################################

export const boxStepSeeder = async (prisma, boxesCollection) =>  {
    const boxSteps = [
        {
          id: 1,
          interval: 0,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 2,
          interval: 1,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 3,
          interval: 3,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 4,
          interval: 7,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 5,
          interval: 21,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 6,
          interval: 30,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 7,
          interval: 90,
          box: { connect : { id : boxesCollection[0].id }}
        },
        {
          id: 8,
          interval: 0,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 9,
          interval: 1,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 10,
          interval: 3,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 11,
          interval: 7,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 12,
          interval: 21,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 13,
          interval: 30,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 14,
          interval: 90,
          box: { connect : { id : boxesCollection[2].id }}
        },
        {
          id: 15,
          interval: 0,
          box: { connect : { id : boxesCollection[1].id }}
        },
        {
          id: 16,
          interval: 1,
          box: { connect : { id : boxesCollection[1].id }}
        },
        {
          id: 17,
          interval: 3,
          box: { connect : { id : boxesCollection[1].id }}
        },
        {
          id: 18,
          interval: 5,
          box: { connect : { id : boxesCollection[1].id }}
        },
        {
          id: 19,
          interval: 7,
          box: { connect : { id : boxesCollection[1].id }}
        },
        {
          id: 22,
          interval: 0,
          box: { connect : { id : boxesCollection[3].id }}
        },
        {
          id: 23,
          interval: 1,
          box: { connect : { id : boxesCollection[3].id }}
        },
        {
          id: 24,
          interval: 3,
          box: { connect : { id : boxesCollection[3].id }}
        },
        {
          id: 25,
          interval: 5,
          box: { connect : { id : boxesCollection[3].id }}
        },
        {
          id: 26,
          interval: 7,
          box: { connect : { id : boxesCollection[3].id }}
        },
      ]
    
      const boxStepsCollection = await prisma.$transaction(
        boxSteps.map(boxStep =>
          prisma.boxStep.upsert({
            where: { id: boxStep.id },
            update: {},
            create: {
              interval: boxStep.interval,
              box: boxStep.box
            }
          })
        )
      )
  return boxStepsCollection
}