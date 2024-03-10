import { Prisma } from "@prisma/client"

const staffWithTeamAndRedemptions = Prisma.validator<Prisma.StaffDefaultArgs>()({
	include: { 
        team: {
            include: {
                redemptions: true
            }
        } 
    },
})

export type StaffWithTeamAndRedemptions = Prisma.StaffGetPayload<typeof staffWithTeamAndRedemptions>