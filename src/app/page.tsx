'use client'

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { SearchBar } from "./components/SearchBar"
import { useDebounce } from 'use-debounce';
import { StaffTable } from "./components/StaffTable";
import { Pagination, Spinner } from "@nextui-org/react";

import type { StaffWithTeamAndRedemptions } from "../../types";
import type { GetStaffBySearchPaginatedResponse } from "./api/staff/route";

const PAGE_SIZE = 10;

export default function Home() {
	const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
	const [autoCompleteItems, setAutoCompleteItems] = useState<StaffWithTeamAndRedemptions[]>([]);

	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebounce(search, 200);

	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [initialLoad, setInitialLoad] = useState(true);
	const [staff, setStaff] = useState<StaffWithTeamAndRedemptions[]>([]);

	const getAutoCompleteItems = async () => {
		try {
			setAutoCompleteLoading(true);
			const res = await axios.get<GetStaffBySearchPaginatedResponse>('/api/staff', {
				params: {
					search: search,
					page: 0,
					pageSize: 10 // limit the number of autocomplete items
				}
			});

			setAutoCompleteItems(res.data.result);
		} catch (error: AxiosError | any) {
			toast.error('Error: ' + error.response.data);
		} finally {
			setAutoCompleteLoading(false);
		}
	}

	const fetchStaff = async () => {
		try {
			const res = await axios.get<GetStaffBySearchPaginatedResponse>('/api/staff', {
				params: {
					search: debouncedSearch,
					page: currentPage - 1,
					pageSize: PAGE_SIZE
				}
			});

			setStaff(res.data.result);
			setTotalPages(Math.ceil(res.data.total / PAGE_SIZE));
		} catch (error: AxiosError | any) {
			toast.error('Error: ' + error.response.data);
		} finally {
			setInitialLoad(false);
		}
	}

	useEffect(() => {
		fetchStaff();
	}, [currentPage])

	useEffect(() => {
		if (debouncedSearch.length > 0) getAutoCompleteItems();
		else setAutoCompleteItems([]);
	}, [debouncedSearch])
			
	return (
		<main 
			className="bg-[#1A1A1A] relative flex flex-col gap-2 min-h-screen min-w-screen flex-col py-24 px-48 transition duration-300 ease-in-out"
		>
			<div className="font-semibold text-lg tracking-wider">
				Gift Redemption System
			</div>
			<div className="flex flex-col justify-center gap-2 w-full">
				<SearchBar 
					setSearch={setSearch}
					items={autoCompleteItems}
					loading={autoCompleteLoading}
				/>
				<StaffTable 
					items={
						autoCompleteItems.length == 1 ? autoCompleteItems : staff
					}
					fetchStaff={fetchStaff}
				/>
				{ initialLoad && (
					<div className="flex justify-center pt-12">
						<Spinner size="lg" />
					</div>
				
				)}
				{ !initialLoad && autoCompleteItems.length != 1 && (
					<Pagination 
						total={totalPages}
						page={currentPage}
						onChange={(page) => setCurrentPage(page)}
					/>
				)}
			</div>
		</main>
	);
}
