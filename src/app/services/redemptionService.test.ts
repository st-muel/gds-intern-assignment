// test/redemptionService.test.ts
import { describe, expect, test, vi } from 'vitest';
import { redemptionService } from './redemptionService';
import prisma from '../../../prisma/__mocks__/client';
import { NotFoundError } from '../errors';

vi.mock('../../../prisma/client')

describe('redemptionService: redeemGiftByTeamId', () => {
    test('redeemGiftByTeamId should successfully redeem gift if the team has not redeemed it before', async () => {
        const team = {
            id: 'TEAM_1234',
            name: 'Team 1',
        }

        prisma.team.findFirst.mockResolvedValue({ ...team })
        prisma.redemption.count.mockResolvedValue(0)

        prisma.redemption.create.mockResolvedValue({
            // @ts-ignore - only the team name is needed
            team: {
                name: team.name
            }
        })
        
        const redemption = await redemptionService.redeemGiftByTeamId({ teamId: team.id })
        expect(redemption).toStrictEqual({ team: { name: team.name } })
    })

    test('redeemGiftByTeamId should throw an error if team has already redeemed a gift', async () => {
        const team = {
            id: 'TEAM_1234',
            name: 'Team 1',
        }

        prisma.team.findFirst.mockResolvedValue({ ...team })
        prisma.redemption.count.mockResolvedValue(1)

        expect(
            redemptionService.redeemGiftByTeamId({ teamId: team.id })
        ).rejects.toThrowError('Team has already redeemed their gift')
    })

    test('redeemGiftByTeamId should should throw error for invalid team', async () => {
        const team = {
            id: 'TEAM_1234',
            name: 'Team 1',
        }

        prisma.team.findFirst.mockResolvedValue(null)
        
        expect(
            redemptionService.redeemGiftByTeamId({ teamId: team.id })
        ).rejects.toThrowError(NotFoundError)
    })
})