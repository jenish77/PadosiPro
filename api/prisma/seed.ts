import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PadosiPro Task Catalogue...');

  // Clean existing task data
  await prisma.userTaskSelection.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.taskCategory.deleteMany({});

  const categories = [
    {
      name: 'Home',
      description: 'Home maintenance, repairs, cleaning & improvements',
      iconName: 'home',
      displayOrder: 1,
      tasks: [
        {
          name: 'AC repair',
          description: 'Installation, repair, servicing & gas refill',
          iconName: 'wind',
        },
        {
          name: 'Plumbing',
          description: 'Fix leaks, pipe installations & tap repairs',
          iconName: 'wrench',
        },
        {
          name: 'Deep cleaning',
          description: 'Home deep cleaning, sofa & bathroom sanitization',
          iconName: 'sparkles',
        },
        {
          name: 'Pest control',
          description: 'Termite, cockroach, mosquito & bedbug treatment',
          iconName: 'shield-alert',
        },
        {
          name: 'Electrical work',
          description: 'Wiring, light fixtures, MCB & switch repairs',
          iconName: 'zap',
        },
        {
          name: 'Appliance repair',
          description: 'Washing machine, fridge & microwave fixing',
          iconName: 'tv',
        },
      ],
    },
    {
      name: 'Errands',
      description: 'Daily chores, deliveries, shopping & pickup services',
      iconName: 'shopping-bag',
      displayOrder: 2,
      tasks: [
        {
          name: 'Grocery shopping',
          description: 'Daily essentials, fresh produce & monthly shopping',
          iconName: 'shopping-cart',
        },
        {
          name: 'Medicine delivery',
          description: 'Prescription medicines & emergency healthcare needs',
          iconName: 'activity',
        },
        {
          name: 'Package pickup & drop',
          description: 'Documents, parcels, keys & gift deliveries',
          iconName: 'package',
        },
        {
          name: 'Dry cleaning & laundry',
          description: 'Clothes pickup, steam press & premium laundry',
          iconName: 'scissors',
        },
        {
          name: 'Bill payments',
          description: 'Electricity, water, society & Wi-Fi bill handling',
          iconName: 'credit-card',
        },
      ],
    },
    {
      name: 'Events',
      description: 'Party management, celebrations, health & hospitality',
      iconName: 'calendar',
      displayOrder: 3,
      tasks: [
        {
          name: 'Doctor appointment',
          description: 'Book and manage specialist doctor appointments',
          iconName: 'user-check',
        },
        {
          name: 'Event planning',
          description: 'Birthdays, anniversaries, get togethers & celebrations',
          iconName: 'gift',
        },
        {
          name: 'Catering & food',
          description: 'Custom party menus, live snacks & chef at home',
          iconName: 'coffee',
        },
        {
          name: 'Party decoration',
          description: 'Balloons, floral setup & theme party decor',
          iconName: 'sun',
        },
        {
          name: 'Photographer booking',
          description: 'Event coverage, portraits & video highlights',
          iconName: 'camera',
        },
      ],
    },
    {
      name: 'Admin',
      description: 'Documentation, financial work, travel & home supervision',
      iconName: 'file-text',
      displayOrder: 4,
      tasks: [
        {
          name: 'Document assistance',
          description: 'Passport, Aadhar, PAN & rent agreement registration',
          iconName: 'file-check',
        },
        {
          name: 'Bank & tax errands',
          description: 'CA consultation, cheque drop & document submissions',
          iconName: 'briefcase',
        },
        {
          name: 'Travel booking',
          description: 'Flight, train, cab & hotel reservations',
          iconName: 'navigation',
        },
        {
          name: 'Vehicle registration',
          description: 'RTO documentation, fastag & insurance renewal',
          iconName: 'truck',
        },
        {
          name: 'Home supervisor',
          description: 'Check house while away, key management & plant care',
          iconName: 'eye',
        },
      ],
    },
  ];

  for (const cat of categories) {
    const createdCategory = await prisma.taskCategory.create({
      data: {
        name: cat.name,
        description: cat.description,
        iconName: cat.iconName,
        displayOrder: cat.displayOrder,
      },
    });

    for (const t of cat.tasks) {
      await prisma.task.create({
        data: {
          categoryId: createdCategory.id,
          name: t.name,
          description: t.description,
          iconName: t.iconName,
        },
      });
    }
  }

  const totalTasks = await prisma.task.count();
  const totalCategories = await prisma.taskCategory.count();
  console.log(`Seeding completed! Created ${totalCategories} categories and ${totalTasks} tasks.`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
