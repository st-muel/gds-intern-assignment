import { NotFoundError } from "../errors";
import { DateTime } from 'luxon';
import prisma from '../../../prisma/client';

interface RedeemGiftByTeamIdRequest {
    teamId: string;
}

const redeemGiftByTeamId = async (data: RedeemGiftByTeamIdRequest) => {
    const { teamId } = data;

    const team = await prisma.team.findFirst({
        where: {
            id: teamId
        }
    });

    if (!team) {
        throw new NotFoundError('Team not found');
    }

    // Check if the team has already redeemed their gift
    const redemptionCount = await prisma.redemption.count({
        where: {
            teamId
        }
    });

    if (redemptionCount > 0) {
        throw new Error('Team has already redeemed their gift');
    }

    // Redeem the gift for the team
    const redemption = await prisma.redemption.create({
        data: {
            teamId: team.id,
            redeemedAt: DateTime.now().toMillis()
        },
        include: {
            team: {
                select: {
                    name: true
                }
            }
        }
    });

    return redemption;
}

export const redemptionService = {
    redeemGiftByTeamId
}