// test/staffService.test.ts
import { expect, test, vi, describe } from 'vitest';
import { staffService } from './staffService';
import { DateTime } from 'luxon';
import prisma from '../../../prisma/__mocks__/client';
import { NotFoundError } from '../errors';

vi.mock('../../../prisma/client')

describe('staffService: getStaffFromStaffId', () => {
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
})

describe("staffService: getStaffBySearchPaginated", () =>{
	test('getStaffBySearchPaginated should return the first 10 staff and total count', async () => {
		// Create staff members
		const staff = Array.from({ length: 20 }, (_, i) => ({
			id: `STAFF_H123804820F${i}`,
			teamName: `Team ${i}`,
			createdAt: BigInt(DateTime.now().toMillis()),
			teamId: `TEAM_1234${i}`,
		}))

		prisma.staff.findMany.mockResolvedValue(staff)
		prisma.staff.count.mockResolvedValue(20)

		const result = await staffService.getStaffBySearchPaginated({ search: '', page: 0, pageSize: 10 })
		expect(result).toStrictEqual({ staff, total: 20 })
	})
})

describe("staffService: getStaffBySearchPaginated", () =>{
	test('getStaffBySearchPaginated should return page 2 of the staff and total count', async () => {
		// Create staff members
		const staff = Array.from({ length: 30 }, (_, i) => ({
			id: `STAFF_H123804820F${i}`,
			teamName: `Team ${i}`,
			createdAt: BigInt(DateTime.now().toMillis()),
			teamId: `TEAM_1234${i}`,
		}))

		prisma.staff.findMany.mockResolvedValue(staff.slice(9, 19))
		prisma.staff.count.mockResolvedValue(30)

		const result = await staffService.getStaffBySearchPaginated({ search: '', page: 1, pageSize: 10 })
		expect(result).toStrictEqual({ staff: staff.slice(9, 19), total: 30 })
	})
})

describe("staffService: getStaffBySearchPaginated", () => {
	test('getStaffBySearchPaginated should return an empty array when search yields no results', async () => {
		// Create staff members
		const staff = Array.from({ length: 20 }, (_, i) => ({
			id: `STAFF_H123804820F${i}`,
			teamName: `Team ${i}`,
			createdAt: BigInt(DateTime.now().toMillis()),
			teamId: `TEAM_1234${i}`,
		}))

		prisma.staff.findMany.mockResolvedValue([])
		prisma.staff.count.mockResolvedValue(20)

		const result = await staffService.getStaffBySearchPaginated({ search: 'NO SUCH STAFF', page: 1, pageSize: 10 })
		expect(result).toStrictEqual({ staff: [], total: 20 })
	})
})