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
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].trim().split(',');
				
				const [staffId, teamName, createdAt] = values;
				
				const team = await prisma.team.upsert({
					where: {
						name: teamName
					},
					update: {},
					create: {
						name: teamName
					}
				})

				// Create the staff member
				await prisma.staff.upsert({
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
				});
			}
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