
//  #################################################
//  ############           TAGS          ############
//  #################################################

export const tagSeeder = async (prisma, colorsCollection) =>  {

    const tags = [
        { 
          id: 1, 
          name: "Histoire", 
          color: { connect : { id:colorsCollection[0].id } }
        },
        { 
          id: 2,
          name: "Geographie",
          color: { connect : { id:colorsCollection[1].id  } }
        },
        { 
          id: 3,
          name: "Anglais",
          color: { connect : { id:colorsCollection[2].id } }
        },
        { 
          id: 4,
          name: "Français",
          color: { connect : { id:colorsCollection[3].id } }
        },
        { 
          id: 5,
          name: "Mathematique",
          color: { connect : { id:colorsCollection[4].id} }
        },
      ];
    

      const tagsCollection = await prisma.$transaction(
        tags.map(tag =>
          prisma.tag.upsert({
            where: { id: tag.id },
            update: {},
            create: {
              name: tag.name,
              color: tag.color,
            }
          })
        )
      )

  return tagsCollection
}