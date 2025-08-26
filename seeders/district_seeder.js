const mongoose = require('mongoose');
const District = require('../models/district_model'); // Assuming you have a District model
const Constituency = require('../models/constituency_model'); // New Constituency model

const districts = [
    { name: 'Aizawl', constituencies: ['Tuivawl', 'Chalfilh', 'Tawi', 'Aizawl North 1', 'Aizawl North 2', 'Aizawl North 3', 'Aizawl East 1', 'Aizawl East 2', 'Aizawl West 1', 'Aizawl West 2', 'Aizawl West 3', 'Aizawl South 1', 'Aizawl South 2', 'Aizawl South 3'] },
    { name: 'Champhai', constituencies: ['Lengteng', 'Tuichang', 'Champhai North', 'Champhai South', 'East Tuipui'] },
    { name: 'Kolasib', constituencies: ['Tuirial', 'Kolasib', 'Serlui'] },
    { name: 'Lawngtlai', constituencies: ['Tuichawng', 'Lawngtlai West', 'Lawngtlai East'] },
    { name: 'Lunglei', constituencies: ['South Tuipui', 'Lunglei North', 'Lunglei East', 'Lunglei West', 'Lunglei South', 'Thorang', 'West Tuipui'] },
    { name: 'Mamit', constituencies: ['Hachhek', 'Dampa', 'Mamit'] },
    { name: 'Saiha', constituencies: ['Saiha', 'Palak'] },
    { name: 'Serchhip', constituencies: ['Serchhip', 'Tuikum', 'Hrangturzo'] },
    { name: 'Khawzawl', constituencies: ['Tuichang', 'Lengteng'] },
    { name: 'Hnahthial', constituencies: ['Hrangturzo', 'South Tuipui'] },
    { name: 'Saitual', constituencies: ['Tuivawl', 'Chalfilh', 'Tawi'] }
];

const seedDatabase = async () => {
    try {

        await District.deleteMany({});
        await Constituency.deleteMany({});

        for (const district of districts) {
            const createdDistrict = await District.create({ name: district.name });
            const constituencyDocs = district.constituencies.map(name => ({ name, districts: createdDistrict._id }));
            await Constituency.insertMany(constituencyDocs);
        }

        console.log('District seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports=seedDatabase;
