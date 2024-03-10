import { NotFoundError } from "../errors";
import prisma from '../../../prisma/client';

interface GetStaffBySearchPaginatedRequest {
    search: string;
    page: number;
    pageSize: number;
}

interface GetStaffFromStaffIdRequest {
    staffId: string;
}

const getStaffBySearchPaginated = async (data: GetStaffBySearchPaginatedRequest) => {
    const { search, page, pageSize } = data;
 
    const staff = await prisma.staff.findMany({
        where: {
            id: {
                startsWith: search
            }
        },
        include: {
            team: {
                include: {
                    redemptions: true
                }
            }
        },
        take: pageSize,
        skip: page * pageSize,
        orderBy: {
            id: 'asc'
        }
    });

    const total = await prisma.staff.count({
        where: {
            id: {
                startsWith: search
            }
        }
    });

    return {
        staff, 
        total
    }
}

const getStaffFromStaffId = async (data: GetStaffFromStaffIdRequest) => {
    const { staffId } = data;
    
    const staff = await prisma.staff.findFirst({
        where: {
            id: staffId
        }
    });

    if (!staff) {
        throw new NotFoundError('Staff not found. Please check the staff ID and try again.');
    }

    return staff;
}

export const staffService = {
    getStaffFromStaffId,
    getStaffBySearchPaginated
}