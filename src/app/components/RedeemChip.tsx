import { Chip, Spinner, Tooltip } from "@nextui-org/react";
import { DateTime } from "luxon";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import type { StaffWithTeamAndRedemptions } from "../../../types";

interface props {
    item: StaffWithTeamAndRedemptions;
    fetchStaff: () => void;
}

export const RedeemChip = (props: props) => {
    const { item } = props;
    const redeemed = item.team.redemptions.length > 0;
    
    const [loading, setLoading] = useState(false);

    const tryRedeemGift = async (staffId: string) => {
		try {
            setLoading(true);
			const res = await axios.post('/api/redeem', {
				staffId
			});

            // Refresh the staff table
            props.fetchStaff();

			toast.success(
				`Gift redeemed successfully for team ${res.data.redemption.team.name}! Merry Christmas!`
			);
		} catch (error: AxiosError | any) {
			toast.error('Error: ' + error.response.data);
		} finally {
			setLoading(false);
		}
	}

    return (
        <Tooltip
            className="flex justify-center"
            content={
                redeemed ? 
                `Redeemed on ${ DateTime.fromMillis(Number(item.team.redemptions[0].redeemedAt)).toLocaleString(DateTime.DATETIME_MED) }` 
                : ""
            }
        >
            { loading ? (
                <Spinner size="sm" />
            ) : (
                <Chip
                    className={ redeemed ? "" : "hover:cursor-pointer" }
                    color={
                        redeemed ? "success" : "primary"
                    }
                    size="sm" 
                    variant="flat"
                    onClick={() => {
                        if (!redeemed) tryRedeemGift(item.id)
                    }}
                >
                    { redeemed ? "Redeemed" : "Redeem"}
                </Chip>
            )}
        </Tooltip>
    );
}