'use client'

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Spinner from "./components/Spinner";

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [staffPassId, setStaffPassId] = useState('');

	const tryRedeemGift = async () => {
		try {
			setLoading(true);

			const res = await axios.post('/api/redeem', {
				staffId: staffPassId
			});
			toast.success(
				`Gift redeemed successfully for team ${res.data.redemption.team.name}! Merry Christmas!`
			);
		} catch (error: AxiosError | any) {
			toast.error('Error: ' + error.response.data);
		} finally {
			setStaffPassId('');
			setLoading(false);
		}
	}

	return (
		<main className="flex flex-col gap-6 min-h-screen flex-col items-center justify-center p-24 bg-[#51829B]">
			<div className="font-bold text-5xl tracking-wider">
				Gift Redemption System
			</div>
			<div className="flex gap-2">
				<div>
					<input 
						type="text" 
						placeholder="Staff Pass ID" 
						className="py-6 px-3 bg-[#F5F5F5] text-gray-700 text-xl rounded-sm h-10"
						value={staffPassId}
						onChange={e => setStaffPassId(e.target.value)}
					/>
				</div>
				<button 
					className="
						flex justify-center items-center 
						py-6 px-3 w-32 h-10 rounded-sm 
						text-gray-700 text-md font-medium 
						transition duration-300 ease-in-out
						bg-[#F5F5F5] hover:bg-[#9BB0C1] disabled:bg-gray-300 disabled:cursor-not-allowed
					"
					onClick={tryRedeemGift}
					disabled={loading || !staffPassId}
				>
					{ loading ? (
						<Spinner />
					) : (
						<div>Redeem</div>
					)}
				</button>
			</div>
		</main>
	);
}
