//TODO add imports if needed
//TODO doc
/**
 * The main function which calls the application. 
 * Generates a random list of Czech employees and calculates various statistics about them.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

/**
 * Generates a random list of Czech employees according to the given parameters.
 * Each employee has a Czech first name and surname (based on gender), gender, birthdate 
 * (the age is strictly between min and max) and weekly workload.
 * Age is calculated using 365.25 days per year.
 * Birthdates are guaranteed to be unique.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  // Czech names – separate lists for men and women
  const maleNames = ["Jiří", "Jan", "Petr", "Pavel", "Martin", "Tomáš", "Lukáš", "Ondřej", "Michal", "Josef", "Jakub", "Milan", "Václav", "David", "Adam", "Filip", "Matěj", "Daniel", "Marek", "Roman"];
  const femaleNames = ["Marie", "Jana", "Eva", "Hana", "Anna", "Lenka", "Kateřina", "Lucie", "Veronika", "Petra", "Martina", "Tereza", "Zuzana", "Monika", "Barbora", "Kristýna", "Eliška", "Adéla", "Natálie", "Klára"];

  const maleSurnames = ["Novák", "Svoboda", "Novotný", "Dvořák", "Černý", "Procházka", "Kučera", "Veselý", "Horák", "Němec", "Pokorný", "Krejčí", "Kovář", "Beneš", "Marek", "Hájek", "Jelínek", "Král", "Růžička", "Sedláček"];
  const femaleSurnames = ["Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá", "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová", "Pokorná", "Krejčí", "Kovářová", "Benešová", "Marková", "Hájková", "Jelínková", "Králová", "Růžičková", "Sedláčková"];

  const workloads = [10, 20, 30, 40];

  // read input values
  const count = dtoIn.count;
  const minAge = dtoIn.age.min;
  const maxAge = dtoIn.age.max;

  const employees = [];

  // set for already used birthdates (ensures uniqueness)
  const usedBirthdates = new Set();

  // main loop – exactly 'count' employees
  for (let i = 0; i < count; i++) {
    let gender = "";
    let firstName = "";
    let lastName = "";
    let birthdate = "";
    let workload = 0;

    // random gender – 50/50
    if (Math.random() < 0.5) {
      gender = "male";
    } else {
      gender = "female";
    }

    // choose first name based on gender
    if (gender === "male") {
      let index = Math.floor(Math.random() * maleNames.length);
      firstName = maleNames[index];
    } else {
      let index = Math.floor(Math.random() * femaleNames.length);
      firstName = femaleNames[index];
    }

    // choose surname based on gender
    if (gender === "male") {
      let index = Math.floor(Math.random() * maleSurnames.length);
      lastName = maleSurnames[index];
    } else {
      let index = Math.floor(Math.random() * femaleSurnames.length);
      lastName = femaleSurnames[index];
    }

    // calculate birthdate so age is exactly between minAge and maxAge
    let birthDate;
    let attempts = 0;
    do {
      const today = new Date();
      const daysInYear = 365.25;
      let minDays = Math.floor(minAge * daysInYear);
      let maxDays = Math.floor((maxAge + 1) * daysInYear);
      let randomDays = minDays + Math.floor(Math.random() * (maxDays - minDays));
      birthDate = new Date(today.getTime() - randomDays * 24 * 60 * 60 * 1000);
      birthDate.setUTCHours(0, 0, 0, 0);
      attempts++;
      if (attempts > 10000) {
        break;
      }
    }
    while (usedBirthdates.has(birthDate.toISOString().split("T")[0]));

    birthdate = birthDate.toISOString().split("T")[0];
    usedBirthdates.add(birthdate);

    // random workload
    let workloadIndex = Math.floor(Math.random() * workloads.length);
    workload = workloads[workloadIndex];

    // create employee and add it directly to result
    let employee = {
      name: firstName,
      surname: lastName,
      gender: gender,
      birthdate: birthdate,
      workload: workload
    };
    employees.push(employee);
  }

  // return the complete array
  return employees;
}

/**
 * Calculates various statistics from the list of employees including counts by workload,
 * age statistics (average, min, max, median), median workload, average women workload,
 * and returns employees sorted by workload.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  // total count
  const total = employees.length;

  // count by workload
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;
  
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].workload === 10) {
      workload10++;
    } else if (employees[i].workload === 20) {
      workload20++;
    } else if (employees[i].workload === 30) {
      workload30++;
    } else if (employees[i].workload === 40) {
      workload40++;
    }
  }

  // calculate ages for all employees
  const ages = [];
  for (let i = 0; i < employees.length; i++) {
    const age = calculateAge(employees[i].birthdate);
    ages.push(age);
  }

  // average age (rounded to 1 decimal place)
  let sumAge = 0;
  for (let i = 0; i < ages.length; i++) {
    sumAge = sumAge + ages[i];
  }
  const averageAge = Math.round((sumAge / total) * 10) / 10;

  // min and max age
  let minAge = ages[0];
  let maxAge = ages[0];
  for (let i = 1; i < ages.length; i++) {
    if (ages[i] < minAge) {
      minAge = ages[i];
    }
    if (ages[i] > maxAge) {
      maxAge = ages[i];
    }
  }
  minAge = Math.floor(minAge);
  maxAge = Math.floor(maxAge);

  // median age
  const medianAge = Math.round(calculateMedian(ages));

  // median workload
  const workloads = [];
  for (let i = 0; i < employees.length; i++) {
    workloads.push(employees[i].workload);
  }
  const medianWorkload = calculateMedian(workloads);

  // average workload for women
  const womenWorkloads = [];
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].gender === "female") {
      womenWorkloads.push(employees[i].workload);
    }
  }
  
  let averageWomenWorkload = 0;
  if (womenWorkloads.length > 0) {
    let sumWomenWorkload = 0;
    for (let i = 0; i < womenWorkloads.length; i++) {
      sumWomenWorkload = sumWomenWorkload + womenWorkloads[i];
    }
    averageWomenWorkload = Math.round((sumWomenWorkload / womenWorkloads.length) * 10) / 10;
  }

  // sorted by workload (ascending) - using bubble sort
  const sortedByWorkload = [];
  for (let i = 0; i < employees.length; i++) {
    sortedByWorkload.push(employees[i]);
  }
  
  for (let i = 0; i < sortedByWorkload.length; i++) {
    for (let j = 0; j < sortedByWorkload.length - 1 - i; j++) {
      if (sortedByWorkload[j].workload > sortedByWorkload[j + 1].workload) {
        let temp = sortedByWorkload[j];
        sortedByWorkload[j] = sortedByWorkload[j + 1];
        sortedByWorkload[j + 1] = temp;
      }
    }
  }

  const dtoOut = {
    total: total,
    workload10: workload10,
    workload20: workload20,
    workload30: workload30,
    workload40: workload40,
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: averageWomenWorkload,
    sortedByWorkload: sortedByWorkload
  };

  return dtoOut;
}

/**
 * Calculates the age of a person based on their birthdate.
 * Age is calculated using 365.25 days per year.
 * @param {string} birthdate in ISO format (YYYY-MM-DD)
 * @returns {number} age in years
 */
function calculateAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);
  const diffTime = today - birth;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const age = diffDays / 365.25;
  return age;
}

/**
 * Calculates the median of an array of numbers.
 * @param {Array} arr array of numbers
 * @returns {number} median value
 */
function calculateMedian(arr) {
  // create a copy and sort it
  const sorted = [];
  for (let i = 0; i < arr.length; i++) {
    sorted.push(arr[i]);
  }
  
  // simple bubble sort
  for (let i = 0; i < sorted.length; i++) {
    for (let j = 0; j < sorted.length - 1 - i; j++) {
      if (sorted[j] > sorted[j + 1]) {
        let temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }
  
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

// test
const testInput = {
  count: 50,
  age: { 
    min: 19, 
    max: 35 
  }
};

console.log("Statistics for " + testInput.count + " employees (age " + testInput.age.min + "-" + testInput.age.max + "):");
const result = main(testInput);
console.log("Total:", result.total);
console.log("Workload 10h:", result.workload10);
console.log("Workload 20h:", result.workload20);
console.log("Workload 30h:", result.workload30);
console.log("Workload 40h:", result.workload40);
console.log("Average age:", result.averageAge);
console.log("Min age:", result.minAge);
console.log("Max age:", result.maxAge);
console.log("Median age:", result.medianAge);
console.log("Median workload:", result.medianWorkload);
console.log("Average women workload:", result.averageWomenWorkload);
console.log("\nFirst 3 employees sorted by workload:");
for (let i = 0; i < 3 && i < result.sortedByWorkload.length; i++) {
  console.log(result.sortedByWorkload[i]);
}
/*
Dobrý den, snažil jsem se kód opravit, aby odpovídal zadání a fungoval bez problémů, ale už původní kód měl v sobě pár chybiček.
Později jsem se v tom už ztratil, a nakonec přišel alespoň s touto verzí.
*/
