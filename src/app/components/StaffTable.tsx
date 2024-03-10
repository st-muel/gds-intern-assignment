import React, { Key } from "react";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { DateTime } from "luxon";
import { RedeemChip } from "./RedeemChip";

import type { StaffWithTeamAndRedemptions } from "../../../types";

interface props {
	items: StaffWithTeamAndRedemptions[];
	fetchStaffPage: () => void;
}

interface Column {
	uid: string;
	name: string;
}

const columns: Column[] = [
	{ uid: "id", name: "ID" },
	{ uid: "team", name: "Team" },
	{ uid: "status", name: "Status" }
];

export const StaffTable = (props: props) => {
	const renderCell = React.useCallback((item: StaffWithTeamAndRedemptions, columnKey: Key) => {	
		switch (columnKey) {
			case "id":
				const role = item.id.split('_')[0];
				return (
					<User
						avatarProps={{
							radius: "lg",
							name: item.id[0],
						}}
						description={
							role[0].toUpperCase() + role.slice(1).toLowerCase()
						}
						name={item.id}
					>
						{ item.id }
					</User>
				);
			case "team":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-sm capitalize">
							{ item.team.name }
						</p>
						<p className="text-bold text-sm capitalize text-default-400">
							{ 
								`Joined on ${ DateTime.fromMillis(Number(item.createdAt)).toLocaleString(DateTime.DATE_MED) }`
							}
						</p>
					</div>
				);
			case "status":
				return (
					<RedeemChip
						item={item} 
						fetchStaffPage={props.fetchStaffPage}
					/>
				);
			default:
				return item.id;
		}
	  }, []);

	return (
		<Table 
			aria-label="Table for item"
			removeWrapper
		>
			<TableHeader columns={columns}>
				{ (column: Column) => (
					<TableColumn key={column.uid} align="start">
						{ column.name }
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={props.items}>
				{(item) => (
				<TableRow key={item.id}>
					{(columnKey) => <TableCell>
						{ renderCell(item, columnKey) }
					</TableCell>}
				</TableRow>
				)}
			</TableBody>
		</Table>
	);
}