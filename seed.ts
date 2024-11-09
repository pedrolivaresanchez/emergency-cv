/**
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed';
import { copycat } from '@snaplet/copycat';

const possibleTypes = ['ofrece', 'necesita'];
const possibleLocations = ['Paiporta', 'Aldaia', 'Alfafar', 'Albal', 'Alcudia', 'Bugarra'];
const possibleUrgencies = ['alta', 'media', 'baja'];
const possibleStatus = ['active', 'finished'];

const randomSelector = (option: string[]) => {
  return () => {
    const selector = Math.floor(Math.random() * option.length);
    return option[selector];
  };
};

async function main() {
  const seed = await createSeedClient({
    dryRun: true,
    models: {
      help_requests: {
        data: {
          location: randomSelector(possibleLocations),
          urgency: randomSelector(possibleUrgencies),
          status: randomSelector(possibleStatus),
          type: randomSelector(possibleTypes),
          id: ({ seed }) => copycat.int(seed),
          name: ({ seed }) => copycat.fullName(seed),
          number_of_people: ({ seed }) => copycat.int(seed, { min: 0, max: 5 }),
          contact_info: ({ seed }) => copycat.phoneNumber(seed, { length: 9 }),
          asignees_count: ({ seed }) => copycat.int(seed, { min: 0, max: 4 }),
        },
      },
    },
  });

  await seed.help_requests((x) => x(100));

  process.exit();
}

//main();
