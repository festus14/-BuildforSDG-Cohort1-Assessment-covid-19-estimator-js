/* eslint-disable linebreak-style */
const convertToDays = (periodType, time) => {
  let dayTime;
  switch (periodType) {
    case 'days':
      dayTime = 1 * time;
      break;
    case 'weeks':
      dayTime = 7 * time;
      break;
    case 'months':
      dayTime = 30 * time;
      break;
    default:
      dayTime = time;
      break;
  }
  return dayTime;
};

const estimateInfectedAfterDays = (infected, periodType, time) => {
  const timeInDays = convertToDays(periodType, time);
  const daysFactor = Math.floor(timeInDays / 3);
  const estimatedAfterDays = infected * 2 ** daysFactor;
  return estimatedAfterDays;
};

const severeCasesByTime = (infected) => 0.15 * infected;

const estimateHospitalBedsByTime = (severeCases, totalBeds) => {
  const availableBeds = 0.35 * totalBeds;
  const beds = availableBeds - severeCases;
  if (Number.isInteger(beds)) return beds;
  return Math.floor(beds) + 1;
};

const casesForICUByTime = (infections) => {
  const ICUCases = Math.floor(0.05 * infections);
  return ICUCases;
};

const casesForVentilatorsByTime = (infections) => {
  const ventilatorCases = Math.floor(0.02 * infections);
  return ventilatorCases;
};

const estimateDollarsInFlight = (
  infected,
  Income,
  IncomePopulation,
  population,
  periodType,
  time
) => {
  const timeInDays = convertToDays(periodType, time);
  return Math.floor((infected * Income * IncomePopulation) / timeInDays);
};

const getImpactData = (data) => {
  const impact = {};
  impact.currentlyInfected = data.reportedCases * 10;
  impact.infectionsByRequestedTime = estimateInfectedAfterDays(
    impact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );
  impact.severeCasesByRequestedTime = severeCasesByTime(
    impact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = estimateHospitalBedsByTime(
    impact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );
  impact.casesForICUByRequestedTime = casesForICUByTime(
    impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = casesForVentilatorsByTime(
    impact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = estimateDollarsInFlight(
    impact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD,
    data.region.avgDailyIncomePopulation,
    data.population,
    data.periodType,
    data.timeToElapse
  );
  return impact;
};

const getSevereImpactData = (data) => {
  const severeImpact = {};
  severeImpact.currentlyInfected = data.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = estimateInfectedAfterDays(
    severeImpact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );
  severeImpact.severeCasesByRequestedTime = severeCasesByTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = estimateHospitalBedsByTime(
    severeImpact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );
  severeImpact.casesForICUByRequestedTime = casesForICUByTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = casesForVentilatorsByTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.dollarsInFlight = estimateDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD,
    data.region.avgDailyIncomePopulation,
    data.population,
    data.periodType,
    data.timeToElapse
  );

  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const impact = getImpactData(data);
  const severeImpact = getSevereImpactData(data);

  return { data, impact, severeImpact };
};

// const inputData = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };

export default covid19ImpactEstimator;
