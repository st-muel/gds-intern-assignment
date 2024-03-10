'use client'

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Spinner from "./components/Spinner";

enum RedemptionStatus {
	Idle = 'IDLE',
	Success = 'SUCCESS',
	Failed = 'FAILED'
}

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [staffPassId, setStaffPassId] = useState('');
	const [redeemStatus, setRedeemStatus] = useState(RedemptionStatus.Idle);

	const tryRedeemGift = async () => {
		if (!staffPassId) return;

		try {
			setLoading(true);

			const res = await axios.post('/api/redeem', {
				staffId: staffPassId
			});

			setRedeemStatus(RedemptionStatus.Success);
			toast.success(
				`Gift redeemed successfully for team ${res.data.redemption.team.name}! Merry Christmas!`
			);
		} catch (error: AxiosError | any) {
			setRedeemStatus(RedemptionStatus.Failed);
			toast.error('Error: ' + error.response.data);
		} finally {
			setStaffPassId('');
			setLoading(false);
		}
	}

	const checkForEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			tryRedeemGift();
		}
	}

	useEffect(() => {
		if (redeemStatus != RedemptionStatus.Idle) {
			setTimeout(() => {
				setRedeemStatus(RedemptionStatus.Idle);
			}, 500)
		}
	}, [redeemStatus])

	const backgroundColor = 
		redeemStatus == RedemptionStatus.Idle ? '#51829B' :
		redeemStatus == RedemptionStatus.Success ? '#B0C5A4' :
		'#D37676';
			
	return (
		<main 
			className="relative flex flex-col gap-6 h-screen w-screen flex-col items-center justify-center p-24 transition duration-300 ease-in-out"
			style={{
				backgroundColor
			}}
		>
			<div className="font-bold text-5xl text-center tracking-wider">
				🎄 Gift Redemption System
			</div>
			<div className="flex justify-center gap-2 w-full">
				<div className="w-3/12">
					<input 
						type="text" 
						placeholder="Staff Pass ID" 
						className="py-6 px-3 w-full bg-[#F5F5F5] text-gray-700 text-xl rounded-sm h-10"
						value={staffPassId}
						onChange={e => setStaffPassId(e.target.value)}
						onKeyDown={checkForEnter}
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
						<div>Redeem 🎁</div>
					)}
				</button>
			</div>
		</main>
	);
}
