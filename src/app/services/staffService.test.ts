// test/staffService.test.ts
import { expect, test, vi } from 'vitest';
import { staffService } from './staffService';
import { DateTime } from 'luxon';
import prisma from '../../../prisma/__mocks__/client';
import { NotFoundError } from '../errors';

vi.mock('../../../prisma/client')

test('getStaffFromStaffId should create and return the generated staff', async () => {
	const newStaff = {
		id: 'STAFF_H123804820F',
		teamName: 'Team 1',
		createdAt: BigInt(DateTime.now().toMillis()),
		teamId: 'TEAM_1234',
	}

	prisma.staff.findFirst.mockResolvedValue({ ...newStaff })
	
	const staff = await staffService.getStaffFromStaffId({ staffId: newStaff.id })
	expect(staff).toStrictEqual({ ...newStaff })
})

test('getStaffFromStaffId should throw error for invalid staff', async () => {
	const newStaff = {
		id: 'STAFF_H123804820F',
		teamName: 'Team 1',
		createdAt: BigInt(DateTime.now().toMillis()),
		teamId: 'TEAM_1234',
	}
	
	expect(
		staffService.getStaffFromStaffId({ staffId: newStaff.id })
	).rejects.toThrowError(NotFoundError)
})