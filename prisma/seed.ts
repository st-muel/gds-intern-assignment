import { PrismaClient, Team } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient();
const seedDirectory = '/seeds';

async function main() {
	const seedDirectoryPath = path.join(__dirname, seedDirectory);
	fs.readdir(seedDirectoryPath, async function (err: any, files: string[]) {
		if (err) {
		  console.error('Error reading directory:', err);
		  return;
		}
	  
		const csvFiles = files.filter(file => file.endsWith('.csv'));
		for (const file of csvFiles) {
			const filePath = path.join(seedDirectoryPath, file);
			const data = fs.readFileSync(filePath, 'utf8');
			
			const lines = data.split('\n');
			
			const teamsFound = new Set<string>();
			const teamTransactions = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].trim().split(',');
				const [staffId, teamName, createdAt] = values;

				if (teamsFound.has(teamName)) continue;
				
				teamsFound.add(teamName);
				teamTransactions.push(prisma.team.upsert({
					where: {
						name: teamName
					},
					update: {},
					create: {
						name: teamName
					}
				}));
			}
	
			const teams = await prisma.$transaction(teamTransactions);
		
			const staffTransactions = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].trim().split(',');
				const [staffId, teamName, createdAt] = values;

				const team = teams.find(t => t.name === teamName);
				if (!team) throw new Error('Team not found');

				// Create the staff member
				staffTransactions.push(prisma.staff.upsert({
					where: {
						id: staffId
					},
					update: {
						teamId: team.id,
						createdAt: parseInt(createdAt)
					},
					create: {
						id: staffId,
						teamId: team.id,
						createdAt: parseInt(createdAt)
					}
				}));
			}

			await prisma.$transaction(staffTransactions);
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})