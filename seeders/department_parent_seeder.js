const mongoose = require("mongoose");
const DepartmentParent = require("../models/department_parent_model");

const departmentParents = [
    { name: "Agriculture Department", code: "Agriculture" },
    { name: "Animal Husbandry & Veterinary Department", code: "AH&V" },
    { name: "Art & Culture Department", code: "A&C" },
    { name: "Commerce & Industries Department", code: "C&I" },
    { name: "Co-operation Department", code: "Cooperation" },
    { name: "Disaster Management & Rehabilitation Department", code: "DM&R" },
    { name: "District Council & Minority Affairs Department", code: "DC&MA" },
    { name: "Environment, Forests & Climate Change Department", code: "EF&CC" },
    { name: "Excise & Narcotics Department", code: "E&N" },
    { name: "Finance Department", code: "FD" },
    { name: "Fisheries Department", code: "Fisheries" },
    { name: "Food, Civil Supplies & Consumer Affairs Department", code: "FCS&CA" },
    { name: "General Administration Department", code: "GAD" },
    { name: "Health & Family Welfare Department", code: "H&FW" },
    { name: "Higher & Technical Education Department", code: "H&TE" },
    { name: "Home Department", code: "Home" },
    { name: "Horticulture Department", code: "Horticulture" },
    { name: "Information & Communication Technology Department", code: "ICT" },
    { name: "Information, Public Relations, Printing & Stationery Department", code: "IPRP&S" },
    { name: "Irrigation & Water Resources Department", code: "I&WR" },
    { name: "Labour, Employment, Skill Development & Entrepreneurship Department", code: "LESDE" },
    { name: "Land Resources, Soil & Water Conservation Department", code: "LR, S&WC" },
    { name: "Land Revenue & Settlement Department", code: "LR&S" },
    { name: "Law & Judicial Department", code: "L&J" },
    { name: "Rural Development & Administration Department", code: "RD&AD" },
    { name: "Parliamentary Affairs Department", code: "PA" },
    { name: "Personnel & Administrative Reforms Department", code: "P&AR" },
    { name: "Planning & Programme Implementation Department", code: "P&PI" },
    { name: "Political & Cabinet Department", code: "P&C" },
    { name: "Power & Electricity Department", code: "P&E" },
    { name: "Public Health Engineering Department", code: "PHED" },
    { name: "Public Works Department", code: "PWD" },
    { name: "School Education Department", code: "SED" },
    { name: "Secretariat Administration Department", code: "SAD" },
    { name: "Sericulture Department", code: "Sericulture" },
    { name: "Social Welfare & Tribal Affairs Department", code: "SW&TA" },
    { name: "Sports & Youth Services Department", code: "SYS" },
    { name: "Tourism Department", code: "Tourism" },
    { name: "Transport Department", code: "Transport" },
    { name: "Urban Development & Poverty Alleviation Department", code: "UD&PA" },
    { name: "Vigilance Department", code: "Vigilance" }
];

const seedDepartmentParent = async () => {
    try {
        await DepartmentParent.deleteMany();
        await DepartmentParent.insertMany(departmentParents);
        console.log("Parent Departments seeded successfully!");
    } catch (error) {
        console.error("Parent Department seeding failed:", error);
    }
};

if (require.main === module) {
    require("dotenv").config();
    const connectDB = require("../config/db");
    (async () => {
        await connectDB();
        await seedDepartmentParent();
        await mongoose.connection.close();
    })();
}

module.exports = seedDepartmentParent;

