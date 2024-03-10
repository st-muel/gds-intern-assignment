import { staffService } from "@/app/services/staffService";
import { z } from "zod";

import type { StaffWithTeamAndRedemptions } from "../../../../types";

export interface GetStaffBySearchPaginatedResponse {
    result: StaffWithTeamAndRedemptions[];
    total: number;
}

const ParamsSchema = z.object({
    search: z.string().default(''),
    page: z.coerce.number().default(0),
    pageSize: z.coerce.number().default(10)
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const params = ParamsSchema.parse({
        search: searchParams.get('search'),
        page: searchParams.get('page'),
        pageSize: searchParams.get('pageSize')
    });
    const { search, page, pageSize } = params;
    
    const { staff, total } = await staffService.getStaffBySearchPaginated({ 
        search: search.toUpperCase(),
        page: page, 
        pageSize: pageSize 
    });

    // Convert bigInt to string to allow for JSON serialization
    const serializedStaff = staff.map((staff) => {
        const serializedRedemptions = staff.team.redemptions.map((redemption) => {
            return {
                ...redemption,
                redeemedAt: redemption.redeemedAt.toString(),
            }
        })

        return {
            ...staff,
            team: {
                ...staff.team,
                redemptions: serializedRedemptions
            },
            createdAt: staff.createdAt.toString(),
        }
    })

    return Response.json({ result: serializedStaff, total: total }, { status: 200 })
}