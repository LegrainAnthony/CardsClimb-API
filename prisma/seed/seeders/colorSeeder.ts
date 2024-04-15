
//  #################################################
//  ############          COLORS         ############
//  #################################################

export const colorSeeder = async (prisma) =>  {

    const colors = [
        { id: 1, name: "ORANGE", hex: "#FB923C"},
        { id: 2, name: "RED", hex: "#F87171"},
        { id: 3, name: "AMBER", hex: "#FBBF24"},
        { id: 4, name: "YELLOW", hex: "#FACC15"},
        { id: 5, name: "LIME", hex: "#A3E635"},
        { id: 6, name: "EMERALD", hex: "#34D399"},
        { id: 7, name: "TEAL", hex: "#2DD4BF"},
        { id: 8, name: "CYAN", hex: "#22D3EE"},
        { id: 9, name: "SKY", hex: "#38BDF8"},
        { id: 10, name: "BLUE", hex: "#60A5FA"},
        { id: 11, name: "INDIGO", hex: "#818CF8"},
        { id: 12, name: "VIOLET", hex: "#A78BFA"},
        { id: 13, name: "PURPLE", hex: "#C084FC"},
        { id: 14, name: "FUSCHIA", hex: "#E879F9"},
        { id: 15, name: "PINK", hex: "#F472B6"},
        { id: 16, name: "ROSE", hex: "#FB7185"}
      ];

    const colorsCollection = await prisma.$transaction(
        colors.map(color =>
        prisma.color.upsert({
            where: {id: color.id, name: color.name, hex: color.hex },
            update: {},
            create: {
            name: color.name,
            hex: color.hex
            }
        })
        )
    )

  return colorsCollection
}