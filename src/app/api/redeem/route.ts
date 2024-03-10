import { redemptionService } from "@/app/services/redemptionService";
import { staffService } from "@/app/services/staffService";

export async function POST(request: Request) {
    const { staffId } = await request.json();

    if (!staffId) {
        return new Response('Staff ID is required', { status: 400 });
    }

    // Check to make sure this staff exists
    let staff;
    try {
        staff = await staffService.getStaffFromStaffId({ staffId });
    } catch (error: any) {
        return new Response(error.message, { status: 404 });
    }

    // Check to make sure this staff is part of a team
    if (!staff.teamId) {
        return new Response('Staff is not part of a team', { status: 400 });
    }

    // Try to redeem the gift for the team
    let redemption;
    try {
        redemption = await redemptionService.redeemGiftByTeamId({ teamId: staff.teamId });
    } catch (error: any) {
        if (error.name === 'NotFoundError') {
            return new Response(error.message, { status: 404 });
        }

        return new Response(error.message, { status: 400 });
    }

    return Response.json({ redemption: redemption }, { status: 200 })
}