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

const estimateHospitalBedsByTime = (severeCases, totalBeds) => {
  const availableBeds = Math.floor(0.35 * totalBeds);
  if (availableBeds >= severeCases) return availableBeds;
  return availableBeds - severeCases;
};

const estimateDollarsInFlight = (infected, avgIncome, periodType, time) => {
  const timeInDays = convertToDays(periodType, time);
  return Math.floor(infected * 0.65 * avgIncome * timeInDays);
};

const severeCasesByTime = (infected) => Number((0.15 * infected).toFixed(1));

const casesForICUByTime = (infectionsByTime) => {
  const val = Math.floor(0.05 * infectionsByTime);
  return val;
};

const casesForVentilatorsByTime = (infectionsByTime) => {
  const val = Math.floor(0.02 * infectionsByTime);
  return val;
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

export default covid19ImpactEstimator;
