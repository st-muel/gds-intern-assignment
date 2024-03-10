> .env file has been commit ONLY FOR ASSIGNMENT PURPOSES. Considered including an .env.example file instead, but would have just been the same as including the .env file just with an extra step. WOULD NEVER DO THIS IN ACTUAL PROJECTS.

## About The Project
This project is the take-home assignment for gds-swe-supplyally-govwallet. It is also mobile responsive!

## Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Vitest][Vitest]][Vitest-url]

## Getting Started

First, install all required dependencies.
```bash
pnpm install
```

Then, create and seed the local database. (A local database was used for this assignment due to difficulties providing a secure env file, but it could easily be hosted using services like [Planetscale](https://planetscale.com/]))
```bash
pnpm prisma migrate dev
```

Finally, run the development server:

```bash
pnpm dev
```

The project can be accessed at [http://localhost:3000](http://localhost:3000)!

## Testing

Unit testing for this project is handled by [Vitest][Vitest-url]. The database is mocked so there will be no actual changes to the database.

```bash
pnpm test
```

## Reseeding

Should you wish to refresh the database entirely, starting with a clean slate, kindly execute the following command:

```bash
pnpm prisma db push --force-reset && pnpm prisma db seed
```

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Vitest]: https://img.shields.io/badge/-Vitest-%252529?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
