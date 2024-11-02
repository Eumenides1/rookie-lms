// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: 'Java'},
                {name: 'AIGC'},
                {name: 'Python'},
                {name: 'Go'},
                {name: '程序人生'},
            ]
        })
        console.log("Success");
        
    } catch (error) {
        console.log("Error seeding the database categories", error);
        
    } finally {
        await database.$disconnect()
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});