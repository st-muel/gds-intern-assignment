import { NotFoundError } from "../errors";
import prisma from '../../../prisma/client';

interface GetStaffFromStaffIdRequest {
    staffId: string;
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
    getStaffFromStaffId
}